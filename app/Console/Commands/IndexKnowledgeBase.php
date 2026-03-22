<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\AI\TextChunker;
use App\AI\VectorStore\MySQLVectorStore;
use App\Models\KnowledgeBase;
use App\Models\RouteDay;
use App\Models\TeaHouse;
use App\Models\TrekkingRoute;

 /**
     * Data integration pipeline: knowledgebase rows -> chunk -> embed(Gemini) -> MySQLVectoreStore
     * Indesing supplimentary sources so that AI has rich trial context beyoind the KB
     * php artisan kb:index #index only new/ unindexed row
     * php artisan kb:index --force #reindex everything
     * php artisan kb:index --source-kb #only knowledge base entries
     */

class IndexKnowledgeBase extends Command
{

    protected $signature = 'kb:index
        {--force:Clear and re-index all embeddings}
        {--source-all:Source to index all}
        {--dry-run:Show what would be indexed without writing}';

    protected $description = 'Run the RAG data ingestion pipeline (KnowledgeBase → embed → vector store)';

    public function __construct(
        private readonly MySQLVectorStore $vectoreStore,
        private readonly TextChunker $chunker
    )
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $source=$this->options('source');
        $force=$this->options('force');
        $dry=$this->option('dry-run');

        if($force && !$dry){
            $this->warn('--force: clearing all eexisting embeddings...');
            \App\Models\Embedding::truncate();
        }

        $this->info('═══ TrekSathi — Knowledge Base Indexer ═══');
        $this->newLine();

        $total=0;

        if(in_array($source, ['all','kb'])){
            $total += $this->indexKnowledgBase($dry);
        }

        if(in_array($source, ['all','routes'])){
            $total += $this->indexTrekkingRoutes($dry);
        }

        if(in_array($source, ['all','days'])){
            $total += $this->indexRouteDays($dry);
        }

        $this->newLine();
        $this->info("Done. Total chunk indexed: {$total}");

        return self::SUCCESS;
    }

    //sources
    private function indexKnowledgBase(bool $dry): int
    {
        $entries = KnowledgeBase::where('is_indexed',false)->get();
        $this->line("KnowledgeBase: {$entries->count()} unindexed entries");

        if($entries->isEmpty()){
            return 0;
        }

        $bar=$this->output->createProgressBar($entries->count());
        $count=0;

        foreach($entries as $entry){
            $bar->advance();

            $text= "[{$entry->title}]\n\n{$entry->content}";

            $chunks=$this->chunker->split($text);

            if(!$dry){
                $docs=array_map(fn (string $chunk)=>[
                    'source_type'=>'knowledge_base',
                    'source_id'=>$entry->id,
                    'content'=>$chunk,
                    'metadata'=>[
                        'title'=>$entry->title,
                        'category'=>$entry->category,
                        'source'=>$entry->source,
                        'route_id'=>$entry->trekking_route_id,
                    ],
                ], $chunks);
                $this->vectoreStore->addDocumentBatch($docs);

                $entry->update(['is_indexed',true]);
            }

            $count+=count($chunks);
        }

        $bar->finish();
        $this->newLine();

        return $count;
    }

    private function indexTrekkingRoutes(bool $dry): int
    {
        $routes = TrekkingRoute::with('regions')->get();
        $this->line("TrekkingRoutes: {$routes->count()} routes");
        $count=0;
        $bar=$this->output->createProgressBar($routes->count());

        foreach($routes as $route){
            $bar->advance();

            if(!$route->trekking_description){
                continue;
            }

            $text=implode('\n',array_filter([
                "Trek: {$route->trekking_route_name}",
                "Region:".($route->regions->region_name ?? ''),
                "Difficulty: {$route->difficulty}",
                "Duration:{$route->duration_days} days",
                "Max Altitude: {$route->max_altitude}m",
                "Best Season: {$route->best_season}",
                $route->trekking_description,
            ]));

            $chunks = $this->chunker->split($text);

            if($dry){
                foreach($chunks as $chunk){
                    $this->vectoreStore->addDocument(
                        'trekking_route',
                        $route->id,
                        $chunk,
                        [
                            'title'=>$route->trekking_route_name,
                            'category'=>'Route Overview',
                        ]
                    );
                }
            }
            $count += count($chunks);
        }
        $bar->finish();
        $this->newLine();

        return $count;
    }

    private function indexRouteDays(bool $dry): int
    {
        $days = RouteDay::with('trekkingRoute')->get();
        $this->line("RouteDays: {$days->count()} days");
        $count=0;
        $bar=$this->output->createProgressBar($days->count());

        foreach($days as $day){
            $bar->advance();

            if(!$day->day_description){
                continue;
            }

            $text=implode("\n",[
                "Route: ".($day->trekkingRoute->trekking_route_name ?? 'Unknown'),
                "Day {$day->day_number}: {$day->start_point}->{$day->end_point}",
                "Distance: {$day->Distance_in_km}km | Altitude: {$day->altitude}m",
                $day->days_description,
            ]);

            if(!$day){
                $this->vectoreStore->addDocument(
                    'route_day',
                    $day->id,
                    $text,
                    [
                        'title'=>"Day {$day->day_number}: {$day->start_point}->{$day->end_point}",
                        "category"=>'Route Day',
                        'route_id'=>$day->trekking_route_id,
                    ]
                );
            }
            $count++;
        }
        $bar->finish();
        $this->newLine();
        return $count;
    }

    private function indexTeaHouses(bool $dry):int
    {
        $houses = TeaHouse::with('trekkingRoute')->get();
        $this->line("TeaHouse: {$houses->count()} tea houses");
        $count=0;
        $bar=$this->output->createProgressBar($houses->count());

        foreach($houses as $house){
            $bar->advance();

            $amenities=implode(',',array_filter([
                $house->has_wifi ? 'WIFI' : null,
                $house->has_electricity ? 'Electricity' : null,
            ]));

            $text=implode('\n', array_filter([
                "Tea House: {$house->house_name}",
                "Loaction: {$house->location}",
                $house->altitude_location ? "Altitude: {$house->altitude_location}m" : null,
                $house->cost_per_night ? "Cost: \${$house->cost_per_night}/night" : null,
                $amenities ? "Amenities: {$amenities}" : null,
                $house->trekkingRoute ? "Route: {$house->trekkingRoute->trekking_route_name}" : null,
            ]));

            if(!$dry){
                $this->vectoreStore->addDocument(
                    'tea_house',
                    $house->id,
                    $text,
                    [
                        'title'=>$house->house_name,
                        'category'=>'Accomodation'
                    ]
                );
            }
            $count ++;
        }

        $bar->finish();
        $this->newLine();

    return $count;
    }
}
