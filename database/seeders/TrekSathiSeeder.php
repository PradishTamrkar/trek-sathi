<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TrekSathiSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('regions')->count() > 0) {
            $this->command->warn('Already seeded — skipping. Truncate tables first to re-seed.');
            return;
        }

        $now = Carbon::now();

        // ── 1. REGIONS ────────────────────────────────────────────────────────
        $regions = [
            [
                'region_name'        => 'Khumbu (Everest Region)',
                'region_description' => 'The Khumbu region, home to the world\'s highest peak Mount Everest (8,849m), is Nepal\'s most iconic trekking destination. Lying in the Solukhumbu district of eastern Nepal, this Himalayan wonderland offers spectacular views of Everest, Lhotse, Nuptse, Ama Dablam, and dozens of other peaks above 6,000m. The region is home to the Sherpa people, whose culture, monasteries, and warm hospitality make the trek as culturally rich as it is physically rewarding. The Sagarmatha National Park, a UNESCO World Heritage Site, protects this fragile alpine ecosystem.',
                'best_season'        => 'March–May (spring) and September–November (autumn)',
                'how_to_reach'       => 'Fly from Kathmandu to Lukla (Tenzing-Hillary Airport) on a 35-minute mountain flight. Alternatively, drive/fly to Salleri or Phaplu and trek for 4–5 extra days. Most trekkers fly into Lukla.',
                'region_images'      => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
            [
                'region_name'        => 'Annapurna Region',
                'region_description' => 'The Annapurna region in north-central Nepal is the most visited trekking area in the country, offering extraordinary diversity — from subtropical lowlands and terraced rice paddies to high alpine desert and glacial peaks. The Annapurna massif includes ten peaks over 7,000m, with Annapurna I (8,091m) being the tenth highest mountain in the world. The region encompasses the Annapurna Conservation Area (ACAP), Nepal\'s largest protected area. Trekkers enjoy a rich mix of Gurung, Magar, Thakali, and Tibetan-influenced cultures along the trails.',
                'best_season'        => 'March–May and October–November',
                'how_to_reach'       => 'Fly or take a 6–7 hour bus ride from Kathmandu to Pokhara. The Annapurna Circuit starts from Besisahar (3 hrs from Pokhara) and the Annapurna Base Camp trek starts from Nayapul or Phedi (1.5 hrs from Pokhara).',
                'region_images'      => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
            [
                'region_name'        => 'Langtang Region',
                'region_description' => 'The Langtang region lies just 50km north of Kathmandu, making it the closest Himalayan trekking destination to Nepal\'s capital. Despite its proximity, Langtang remains relatively uncrowded and offers pristine mountain scenery, including the Langtang Lirung (7,227m) and Ganesh Himal range. The region was devastated by the 2015 earthquake but has since been rebuilt. The Tamang and Tibetan communities here maintain a distinct cultural identity. The Langtang National Park protects red pandas, snow leopards, and Himalayan black bears.',
                'best_season'        => 'March–May and October–December',
                'how_to_reach'       => 'Drive from Kathmandu to Syabrubesi (7–8 hours by bus or 5 hours by jeep). The road passes through Trishuli Bazaar and Dhunche. Some trekkers take a local bus from Kathmandu\'s Machha Pokhari bus park.',
                'region_images'      => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
            [
                'region_name'        => 'Manaslu Region',
                'region_description' => 'The Manaslu region in the Gorkha district of north-central Nepal offers a remote and off-the-beaten-path trekking experience around the world\'s eighth highest mountain, Manaslu (8,163m). The Manaslu Circuit trek encircles the entire Manaslu massif, crossing the dramatic Larkya La Pass (5,160m). The region borders Tibet and features strong Tibetan-Buddhist cultural influence, ancient monasteries, and rare wildlife including snow leopards and blue sheep. Trekking here requires a special restricted area permit.',
                'best_season'        => 'March–May and September–November',
                'how_to_reach'       => 'Drive from Kathmandu to Soti Khola (8–10 hours) or Machha Khola via Arughat Bazaar. The road passes through Gorkha. A jeep or private vehicle is strongly recommended for this rough mountain road.',
                'region_images'      => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
            [
                'region_name'        => 'Upper Mustang',
                'region_description' => 'Upper Mustang, known as the "Last Forbidden Kingdom," is a restricted trekking area in the rain shadow of the Himalayas. Formerly an independent kingdom until 1795, Lo Manthang — its walled capital — preserves 15th-century Tibetan Buddhist art, culture, and architecture almost unchanged. The landscape is a surreal high-altitude desert of eroded ochre cliffs, ancient cave dwellings, and mani walls. Annual rainfall is less than 300mm, making this one of the few regions in Nepal trekable even during the monsoon.',
                'best_season'        => 'March–November (monsoon-free due to rain shadow)',
                'how_to_reach'       => 'Fly from Kathmandu to Pokhara, then to Jomsom (20-minute flight). The trek begins from Kagbeni. A special Upper Mustang restricted area permit ($500 USD for 10 days) is required in addition to ACAP.',
                'region_images'      => null,
                'created_at'         => $now,
                'updated_at'         => $now,
            ],
        ];

        DB::table('regions')->insert($regions);
        $regionIds = DB::table('regions')->orderBy('id')->pluck('id', 'region_name');

        // ── 2. TREKKING ROUTES ────────────────────────────────────────────────
        $routes = [
            // EBC
            [
                'region_id'           => $regionIds['Khumbu (Everest Region)'],
                'trekking_route_name' => 'Everest Base Camp Trek',
                'difficulty'          => 'Hellmode',
                'duration_days'       => 14,
                'max_altitude'        => 5364,
                'best_season'         => 'March–May, September–November',
                'permit_required'     => 1,
                'trekking_description'=> 'The Everest Base Camp trek is the ultimate Himalayan adventure, taking trekkers through the legendary Khumbu Valley to the foot of the world\'s highest mountain at 5,364m. Starting with a thrilling mountain flight to Lukla, the trail passes through the famous Sherpa capital Namche Bazaar, the sacred Tengboche Monastery, and the high-altitude villages of Dingboche and Lobuche. The highlight is standing at Everest Base Camp surrounded by the Khumbu Icefall and watching climbers prepare their Everest ascents. An early morning hike to Kala Patthar (5,545m) offers the best panoramic view of Everest, Lhotse, and Nuptse. Proper acclimatization is critical — the standard itinerary includes rest days at Namche Bazaar and Dingboche. The trek is physically demanding but does not require technical climbing skills. Altitude sickness is the primary risk.',
                'trekking_images'     => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
            // Annapurna Circuit
            [
                'region_id'           => $regionIds['Annapurna Region'],
                'trekking_route_name' => 'Annapurna Circuit Trek',
                'difficulty'          => 'Hard',
                'duration_days'       => 18,
                'max_altitude'        => 5416,
                'best_season'         => 'March–May, October–November',
                'permit_required'     => 1,
                'trekking_description'=> 'The Annapurna Circuit is widely considered one of the greatest treks in the world. Circumnavigating the entire Annapurna massif, the trail traverses extraordinary ecological and cultural diversity — from subtropical forests and terraced farmland in the lower valleys to the high-altitude Tibetan plateau around Manang, and finally the barren trans-Himalayan landscape of Mustang beyond the Thorong La Pass. The crowning achievement is crossing the Thorong La Pass (5,416m), the highest trekking pass in the world that is regularly crossed. The circuit passes through villages of Gurung, Magar, and Thakali peoples, each with distinct cultures, foods, and traditions. The trek can be shortened using jeep roads in certain sections, though purists prefer the full walking route.',
                'trekking_images'     => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
            // Annapurna Base Camp
            [
                'region_id'           => $regionIds['Annapurna Region'],
                'trekking_route_name' => 'Annapurna Base Camp Trek',
                'difficulty'          => 'Moderate',
                'duration_days'       => 11,
                'max_altitude'        => 4130,
                'best_season'         => 'March–May, October–November',
                'permit_required'     => 0,
                'trekking_description'=> 'The Annapurna Base Camp (ABC) trek leads into the heart of the Annapurna Sanctuary — a glacial amphitheatre ringed by thirteen peaks over 6,000m, including Annapurna I (8,091m), Machapuchare (6,993m), Hiunchuli (6,441m), and Gangapurna (7,454m). Unlike the Circuit, this trek ascends directly into the mountains via the Modi Khola gorge, passing through terraced farmland, rhododendron forests (spectacular in spring), and high alpine pastures. The base camp at 4,130m sits directly beneath the south face of Annapurna I. This trek is suitable for fit beginners with proper preparation and is one of the most scenic treks in Nepal for its dramatic mountain amphitheatre views.',
                'trekking_images'     => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
            // Langtang
            [
                'region_id'           => $regionIds['Langtang Region'],
                'trekking_route_name' => 'Langtang Valley Trek',
                'difficulty'          => 'Moderate',
                'duration_days'       => 9,
                'max_altitude'        => 4984,
                'best_season'         => 'March–May, October–December',
                'permit_required'     => 0,
                'trekking_description'=> 'The Langtang Valley trek is the easiest way to experience high Himalayan scenery close to Kathmandu. The trail follows the Langtang Khola river through dense bamboo and rhododendron forests into the high-altitude Langtang Valley, home to the Tamang people whose culture blends Tibetan Buddhism with indigenous traditions. The route passes Langtang village (rebuilt after the 2015 earthquake), the cheese-producing village of Kyanjin Gompa (3,870m), and reaches Tserko Ri (4,984m) for panoramic views of Langtang Lirung, Dorje Lakpa, and Gangchenpo. The trek is often extended to include the Gosaikunda Lakes (4,380m), sacred to both Hindus and Buddhists.',
                'trekking_images'     => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
            // Manaslu Circuit
            [
                'region_id'           => $regionIds['Manaslu Region'],
                'trekking_route_name' => 'Manaslu Circuit Trek',
                'difficulty'          => 'Hard',
                'duration_days'       => 16,
                'max_altitude'        => 5160,
                'best_season'         => 'March–May, September–November',
                'permit_required'     => 1,
                'trekking_description'=> 'The Manaslu Circuit is Nepal\'s finest off-the-beaten-path trek, circling the eighth highest mountain in the world through remote villages, ancient monasteries, and dramatic high passes. The trek follows the Budhi Gandaki river valley northward before crossing the Larkya La Pass (5,160m) — the trek\'s dramatic climax. The descent into the Marsyangdi valley connects to the Annapurna Circuit. The region has strong Tibetan-Buddhist culture with ancient gompas at Pungen, Namrung, and Lho. Trekking is in small groups only (minimum 2 people required) and a licensed guide is mandatory. The combination of spectacular scenery, cultural richness, and relative solitude makes this one of Nepal\'s most rewarding treks.',
                'trekking_images'     => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
            // Upper Mustang
            [
                'region_id'           => $regionIds['Upper Mustang'],
                'trekking_route_name' => 'Upper Mustang Trek',
                'difficulty'          => 'Moderate',
                'duration_days'       => 14,
                'max_altitude'        => 4350,
                'best_season'         => 'March–November',
                'permit_required'     => 0,
                'trekking_description'=> 'The Upper Mustang trek takes you to one of the most culturally preserved corners of the Himalayas — the ancient Kingdom of Lo. The landscape is unlike anywhere else in Nepal: a vast Tibetan-style plateau of wind-carved cliffs, ancient cave monasteries, prayer-flag-covered passes, and medieval walled villages. The highlight is Lo Manthang (3,840m), the walled capital with its 600-year-old palace and monasteries containing priceless Buddhist murals. The trek follows the Kali Gandaki gorge — the world\'s deepest river gorge — northward from Kagbeni. Because it lies in the rain shadow of the Annapurnas, Upper Mustang is one of the very few places in Nepal where trekking is excellent during the monsoon season.',
                'trekking_images'     => null,
                'created_at'          => $now,
                'updated_at'          => $now,
            ],
        ];

        DB::table('trekking_routes')->insert($routes);
        $routeIds = DB::table('trekking_routes')->orderBy('id')->pluck('id', 'trekking_route_name');

        // 3. ROUTE DAYS
        $days = [];

        // EBC (14 days)
        $ebcDays = [
            [1,  'Lukla',          'Phakding',        8,   2610, 'Fly to Lukla (2,860m) and begin the trek. The trail descends through pine forests and suspension bridges over the Dudh Koshi river to Phakding. A relatively easy acclimatization day. Pass through Chaurikharka village and cross several colourful suspension bridges.'],
            [2,  'Phakding',       'Namche Bazaar',   11,  3440, 'Cross the famous Hillary Suspension Bridge (3,420m) and make the steep 600m ascent to Namche Bazaar, the commercial hub of the Khumbu. On a clear day, catch your first glimpse of Everest above the ridge. The trail enters Sagarmatha National Park; carry permits for inspection at the park gate.'],
            [3,  'Namche Bazaar',  'Namche Bazaar',   0,   3440, 'Acclimatization rest day in Namche Bazaar. Hike up to the Everest View Hotel (3,880m) for panoramic views of Everest, Lhotse, Nuptse, Thamserku, and Ama Dablam. Visit the Saturday market, the Sherpa Culture Museum, and explore the lively bazaar. This rest day is critical for altitude adjustment.'],
            [4,  'Namche Bazaar',  'Tengboche',       10,  3860, 'Trek through rhododendron and fir forests with continuous Himalayan views. Descend to the Dudh Koshi confluence at Phunki Thanga before climbing steeply to Tengboche. The Tengboche Monastery (3,867m) is the most famous monastery in the Khumbu and hosts the annual Mani Rimdu festival.'],
            [5,  'Tengboche',      'Dingboche',       12,  4360, 'Descend through birch forests to Deboche and Pangboche — one of the oldest villages in the Khumbu with a historic gompa. Continue up the Imja valley to Dingboche. Panoramic views of Ama Dablam (6,812m), Thamserku, and Lhotse.'],
            [6,  'Dingboche',      'Dingboche',       0,   4360, 'Second acclimatization day. Hike to Nangkartshang Gompa (5,090m) above Dingboche for views of Makalu, Cho Oyu, and the Island Peak. Alternatively hike toward Chhukhung valley. Rest and hydrate. Watch for symptoms of AMS — headache, nausea, dizziness.'],
            [7,  'Dingboche',      'Lobuche',         10,  4940, 'Trek across the wide open Pheriche valley with views growing more dramatic. Pass the Thukla (Dugla) memorial — a collection of cairns commemorating climbers who died on Everest. The climb from Thukla to the ridge is steep and altitude makes it challenging. Lobuche sits at the edge of the Khumbu Glacier.'],
            [8,  'Lobuche',        'Gorak Shep',      5,   5170, 'Short but high-altitude trek to Gorak Shep, the last settlement before EBC. The trail follows the lateral moraine of the Khumbu Glacier. Views of Pumori (7,145m) and Lingtren dominate. Afternoon: trek to Everest Base Camp (5,364m) — walk across the Khumbu Glacier, reach the base of the icefall, see expedition tents (spring season). Return to Gorak Shep for the night.'],
            [9,  'Gorak Shep',     'Pheriche',        16,  4280, 'Pre-dawn hike to Kala Patthar (5,545m) — the best viewpoint for Everest, Lhotse, Nuptse, and Changtse, especially at sunrise. Descend back to Gorak Shep for breakfast, then trek all the way down to Pheriche. The long descent is tough on knees but altitude drops significantly.'],
            [10, 'Pheriche',       'Namche Bazaar',   19,  3440, 'Long descent day retracing through Dingboche, Tengboche, and back to Namche Bazaar. Legs will feel the descent. The views are familiar but no less spectacular. Namche feels almost luxurious after the high camp — hot showers, bakeries, and internet.'],
            [11, 'Namche Bazaar',  'Lukla',           18,  2860, 'Final day of trekking — descend from Namche all the way back to Lukla. A long but celebratory day. Arrive in Lukla for a well-deserved meal and a cold beer at one of the lodges. Evening celebration with trekking team.'],
            [12, 'Lukla',          'Kathmandu',       0,   1350, 'Fly back to Kathmandu on the morning mountain flight. Flights are weather-dependent and can be delayed. Afternoon free for shopping at Thamel for souvenirs, thangka paintings, and pashmina. Evening farewell dinner.'],
            [13, 'Kathmandu',      'Kathmandu',       0,   1350, 'Buffer day in Kathmandu for flight delays from Lukla. Explore Boudhanath Stupa (UNESCO World Heritage Site), Pashupatinath Temple, or Swayambhunath. Optional cultural tour or massage.'],
            [14, 'Kathmandu',      'Departure',       0,   1350, 'Transfer to Tribhuvan International Airport for departure. End of the Everest Base Camp trek.'],
        ];
        foreach ($ebcDays as $d) {
            $days[] = ['trekking_route_id' => $routeIds['Everest Base Camp Trek'], 'day_number' => $d[0], 'start_point' => $d[1], 'end_point' => $d[2], 'Distance_in_km' => $d[3], 'altitude' => $d[4], 'days_description' => $d[5], 'created_at' => $now, 'updated_at' => $now];
        }

        // Annapurna Circuit (18 days)
        $acDays = [
            [1,  'Besisahar',      'Bahundanda',      18,  1310, 'Drive or take a local bus from Pokhara to Besisahar (3 hours), the starting point of the Annapurna Circuit. Begin trekking through terraced farmland and rice paddies along the Marsyangdi river. The trail passes through Khudi and Bhulbhule before climbing to Bahundanda. Warm and subtropical at this altitude.'],
            [2,  'Bahundanda',     'Chamje',          20,  1430, 'Descend from Bahundanda and cross the Marsyangdi on a suspension bridge. Trek through the Marsyangdi gorge on narrow trails blasted from rock faces. Pass Ngadi and Lampata. The valley narrows dramatically with waterfalls cascading from cliffs.'],
            [3,  'Chamje',         'Bagarchhap',      15,  2160, 'Cross into the Manang district. The landscape begins to change from subtropical to temperate forest. Pass Tal (the largest lake on the circuit) and the village of Dharapani. Trees include maple, oak, and pine. Enter the Annapurna Conservation Area.'],
            [4,  'Bagarchhap',     'Chame',           14,  2710, 'Trek through forests of fir, birch, and bamboo. Pass Danaque and Timang with first views of Annapurna II (7,937m). Arrive at Chame, the district headquarters of Manang, with banks, medical facilities, and good lodges.'],
            [5,  'Chame',          'Pisang',          16,  3310, 'The trail follows the deep Marsyangdi gorge through apple orchards and pine forest. Pass the famous curved rock wall — a massive cliff that channels the valley. First dramatic views of Annapurna II, III, and Gangapurna. Upper Pisang has a beautiful monastery on the hilltop.'],
            [6,  'Pisang',         'Manang',          18,  3500, 'Two routes available: Upper (via Ghyaru and Ngawal — highly recommended for views) or Lower (flatter, shorter). The upper route offers extraordinary views of the Annapurna range and the Gangapurna glacier lake. Manang (3,500m) is a large, lively town with internet, bakeries, and a HACE/HAPE clinic.'],
            [7,  'Manang',         'Manang',           0,  3500, 'Mandatory acclimatization day in Manang. Hike to Gangapurna Lake (3,540m) or climb to Ice Lake (4,620m) for spectacular views. Attend the afternoon altitude sickness talk at the Himalayan Rescue Association clinic. Rest, eat, and hydrate well.'],
            [8,  'Manang',         'Yak Kharka',      10,  4018, 'Leave the tree line behind. Trek through open grassland and yak pastures. Views of Gangapurna, Annapurna III, and Tilicho Peak. Yak Kharka is a small settlement with basic teahouses — a good stopping point before the big altitude gain to Thorong Phedi.'],
            [9,  'Yak Kharka',     'Thorong Phedi',    8,  4525, 'Short acclimatization day. The trail rises steeply to Thorong Phedi (4,525m) — the base camp for the Thorong La crossing. High Camp is an option (4,925m) for an easier pass day. Go to bed early — most trekkers start the pass at 3–4am.'],
            [10, 'Thorong Phedi',  'Muktinath',       18,  3800, 'The most challenging and rewarding day. Start before dawn (3–4am) to avoid afternoon winds on the pass. Climb steeply for 5–6 hours to the Thorong La Pass (5,416m) — marked by prayer flags and cairns. Descend 1,600m to Muktinath (3,800m), a sacred pilgrimage site for both Hindus and Buddhists with 108 water spouts and eternal flame.'],
            [11, 'Muktinath',      'Jomsom',          18,  2720, 'Descend through the dramatic Mustang landscape — ochre cliffs, wind-swept valleys, and apple orchards. Pass Kagbeni, the gateway to Upper Mustang. Arrive in Jomsom, the capital of Mustang district, with an airport. Many trekkers fly from Jomsom to Pokhara here.'],
            [12, 'Jomsom',         'Marpha',           5,  2670, 'Short optional day to explore Marpha — a beautiful whitewashed Thakali village famous for apple brandy, apple pie, and apple jam. Alternatively take the morning flight from Jomsom to Pokhara.'],
            [13, 'Marpha',         'Kalopani',        20,  2530, 'Trek south through the Kali Gandaki gorge — the world\'s deepest river valley between Dhaulagiri (8,167m) and Annapurna I (8,091m). Strong afternoon winds (up to 60 km/h) are common — start early. Pass Tukuche and Kobang.'],
            [14, 'Kalopani',       'Tatopani',        21,  1190, 'Long descent into increasingly subtropical vegetation. Tatopani means "hot water" — the village has natural hot springs where trekkers soak tired muscles. A very welcome reward after two weeks of trekking.'],
            [15, 'Tatopani',       'Ghorepani',       16,  2874, 'Steep climb of 1,700m from Tatopani to Ghorepani through dense rhododendron forest. In spring (March–April), the forest is ablaze with red, pink, and white rhododendron blossoms. Ghorepani is famous for the Poon Hill sunrise.'],
            [16, 'Ghorepani',      'Poon Hill & Nayapul', 15, 1070, 'Pre-dawn hike to Poon Hill (3,210m) for the most famous sunrise viewpoint in Nepal — a 180° panorama of Dhaulagiri, Annapurna I through IV, Machhapuchhre, Hiunchuli, and dozens more peaks. Descend through Tikhedhunga and Birethanti to Nayapul (roadhead). Drive to Pokhara.'],
            [17, 'Pokhara',        'Pokhara',          0,   820, 'Rest day in Pokhara. Explore Phewa Lake by rowboat, visit the Peace Pagoda, the International Mountain Museum, or simply relax at lakeside restaurants. Pokhara is Nepal\'s adventure capital with paragliding, zip-lining, and ultralight flights available.'],
            [18, 'Pokhara',        'Kathmandu',        0,  1350, 'Fly (25 min) or take tourist bus (7 hours) back to Kathmandu. Evening at leisure in Thamel. End of Annapurna Circuit.'],
        ];
        foreach ($acDays as $d) {
            $days[] = ['trekking_route_id' => $routeIds['Annapurna Circuit Trek'], 'day_number' => $d[0], 'start_point' => $d[1], 'end_point' => $d[2], 'Distance_in_km' => $d[3], 'altitude' => $d[4], 'days_description' => $d[5], 'created_at' => $now, 'updated_at' => $now];
        }

        // Langtang Valley Trek (9 days)
        $ltDays = [
            [1, 'Kathmandu',       'Syabrubesi',       0,  1550, 'Drive from Kathmandu to Syabrubesi (127km, 7–8 hours by bus or 5 hours by jeep). The road passes through Trishuli Bazaar and Dhunche. Syabrubesi sits at the confluence of the Langtang Khola and Bhote Koshi rivers. Register trekking permits at the national park check post.'],
            [2, 'Syabrubesi',      'Lama Hotel',       11, 2380, 'Begin trekking along the Langtang Khola river. The trail enters the bamboo and rhododendron forest immediately. Cross several suspension bridges and pass through small Tamang villages. The forest is dense and the trail relatively gentle. Lama Hotel is a cluster of teahouses in the forest.'],
            [3, 'Lama Hotel',      'Langtang Village', 14, 3430, 'The valley opens dramatically as you climb above the tree line. Pass Ghoda Tabela (horse stable) — an old army post. Enter the wide Langtang valley with views of Langtang Lirung (7,227m) appearing ahead. Langtang village was completely destroyed in the 2015 earthquake avalanche but has been rebuilt. A memorial stupa honors the 243 victims.'],
            [4, 'Langtang Village','Kyanjin Gompa',     5, 3870, 'Short but high day. Trek through yak pastures and mani walls to Kyanjin Gompa, a small monastery settlement with a famous cheese factory established in the 1950s by the Swiss Development Corporation. Try the fresh yak cheese and yogurt. Views of Langtang Lirung and Kimshung are superb.'],
            [5, 'Kyanjin Gompa',   'Tserko Ri & back', 10, 4984, 'Acclimatization/viewpoint day. Hike to Tserko Ri (4,984m) for 360° views of Langtang Lirung, Dorje Lakpa, Shishapangma (Tibet), Gangchenpo, and the Langtang glacier. Alternatively climb Kyanjin Ri (4,773m) for a shorter option. Return to Kyanjin for the night.'],
            [6, 'Kyanjin Gompa',   'Lama Hotel',       19, 2380, 'Descend from Kyanjin back through the Langtang valley. The descent is fast — cover in one day what took two days going up. Stop at Langtang village for lunch.'],
            [7, 'Lama Hotel',      'Syabrubesi',       11, 1550, 'Final trekking day. Descend back through the forest to Syabrubesi. The trail is familiar but the downhill is tough on knees. Evening at a guesthouse in Syabrubesi.'],
            [8, 'Syabrubesi',      'Kathmandu',         0, 1350, 'Drive back to Kathmandu (7–8 hours). Arrive in the evening. Freshen up and explore Thamel for dinner.'],
            [9, 'Kathmandu',       'Departure',         0, 1350, 'Buffer day or departure. Visit Boudhanath or Swayambhunath if time permits. Transfer to airport.'],
        ];
        foreach ($ltDays as $d) {
            $days[] = ['trekking_route_id' => $routeIds['Langtang Valley Trek'], 'day_number' => $d[0], 'start_point' => $d[1], 'end_point' => $d[2], 'Distance_in_km' => $d[3], 'altitude' => $d[4], 'days_description' => $d[5], 'created_at' => $now, 'updated_at' => $now];
        }

        DB::table('route_days')->insert($days);
        $dayIds = DB::table('route_days')->orderBy('id')->pluck('id');

        // ── 4. TEA HOUSES ─────────────────────────────────────────────────────
        // Get route_days ids by route and day number
        $getDayId = function($routeName, $dayNum) use ($routeIds) {
            return DB::table('route_days')
                ->where('trekking_route_id', $routeIds[$routeName])
                ->where('day_number', $dayNum)
                ->value('id');
        };

        $teaHouses = [
            // EBC tea houses
            ['Namche Everest View Lodge',       'Namche Bazaar',   3440, 1800, 1, 1, $getDayId('Everest Base Camp Trek', 2),  'The most famous tea house in Namche Bazaar with direct views of Everest, Lhotse, and Ama Dablam from the dining room. Hot shower, attached bathroom, and a cozy fireplace lounge.'],
            ['Khumbu Lodge',                    'Namche Bazaar',   3440, 1500, 1, 1, $getDayId('Everest Base Camp Trek', 3),  'Popular trekkers lodge in the heart of Namche. Good wifi, charging stations, Western and Nepali food menu. Running hot water. Busy during peak season — book ahead.'],
            ['Tengboche Monastery Guesthouse',  'Tengboche',       3867, 1200, 0, 0, $getDayId('Everest Base Camp Trek', 4),  'Simple guesthouse adjacent to the famous Tengboche Monastery. Basic rooms but extraordinary location with views of Ama Dablam at sunrise. Attend the morning and evening puja at the monastery. No hot shower.'],
            ['Peaceful Lodge Dingboche',        'Dingboche',       4360, 1400, 1, 1, $getDayId('Everest Base Camp Trek', 5),  'Well-run lodge in Dingboche with a large dining room warmed by a yak dung stove. Solar-heated hot water (limited), charging facilities, and good Sherpa hospitality. Dal bhat highly recommended.'],
            ['Eco Lodge Lobuche',               'Lobuche',         4940, 1600, 1, 0, $getDayId('Everest Base Camp Trek', 7),  'One of the better options at this extreme altitude. Solar electricity, electric blankets available for rent, and a warm dining hall. Basic but functional. Bring a sleeping bag rated to -15°C for comfortable sleep.'],
            ['Everest Base Camp Lodge',         'Gorak Shep',      5170, 2000, 1, 0, $getDayId('Everest Base Camp Trek', 8),  'One of only two lodges at Gorak Shep, the highest permanently inhabited settlement in Nepal. Rooms are cold and basic but this is the gateway to EBC and Kala Patthar. Hot drinks and meals are expensive at this altitude. Book well in advance during spring season.'],
            // Annapurna Circuit tea houses
            ['Yak Hotel Manang',                'Manang',          3500,  900, 1, 1, $getDayId('Annapurna Circuit Trek', 6),  'One of the best lodges in Manang with a rooftop terrace overlooking the Gangapurna glacier. Excellent apple pie, WiFi, and a well-stocked bar. Solar hot showers. Great place to spend the acclimatization day.'],
            ['Thorong Phedi High Camp',         'High Camp',       4925, 2200, 1, 0, $getDayId('Annapurna Circuit Trek', 9),  'Located just below the Thorong La Pass, this is the highest teahouse on the Annapurna Circuit. Very basic and extremely cold. Staying here gives you a head start on the pass crossing. Garlic soup and hot tea are essential.'],
            ['Muktinath Guesthouse',            'Muktinath',       3800, 1200, 1, 1, $getDayId('Annapurna Circuit Trek', 10), 'Comfortable lodge near the sacred Muktinath Temple. Hot shower available, good daal bhaat, and a warm welcome after the Thorong La crossing. The temple complex with 108 water spouts is a 5-minute walk away.'],
            ['Hotel Marpha Inn',                'Marpha',          2670,  900, 1, 1, $getDayId('Annapurna Circuit Trek', 12), 'Charming Thakali-style lodge in Marpha, the "apple village" of Mustang. Try homemade apple brandy, apple juice, and apple pie. Clean rooms, reliable WiFi. Whitewashed alleys of Marpha village are beautiful to explore after dinner.'],
            ['Trekkers Inn Tatopani',           'Tatopani',        1190,  800, 1, 1, $getDayId('Annapurna Circuit Trek', 14), 'Lodge right next to the famous Tatopani hot springs. After 2 weeks of trekking, soaking in the natural hot water is pure bliss. Garden seating, cold beer, and banana pancakes. One of the most pleasant nights on the circuit.'],
            // Langtang tea houses
            ['Moonlight Lodge Lama Hotel',      'Lama Hotel',      2380,  700, 0, 0, $getDayId('Langtang Valley Trek', 2),   'Basic but clean lodge in the forest clearing known as Lama Hotel. Wood-fired stove in the dining room, simple meals of dal bhat and noodles. Popular with both trekkers and local porters. Cold rooms — bring a warm sleeping bag.'],
            ['Langtang Village Resort',         'Langtang Village',3430,  900, 1, 1, $getDayId('Langtang Valley Trek', 3),   'One of the new lodges rebuilt after the 2015 earthquake. Family-run with genuine Tamang hospitality. Stunning views of Langtang Lirung. Yak meat and local raksi available. A portion of proceeds goes to the earthquake memorial fund.'],
            ['Kyanjin Gompa Guesthouse',        'Kyanjin Gompa',   3870, 1100, 1, 1, $getDayId('Langtang Valley Trek', 4),   'Best lodge in Kyanjin with views of the glacier from the dining room. Fresh yak cheese from the cheese factory next door. Solar electricity for charging. The owner can arrange yak rides and guide services for Tserko Ri.'],
        ];

        $teaHouseData = [];
        foreach ($teaHouses as $t) {
            $teaHouseData[] = [
                'house_name'        => $t[0],
                'location'          => $t[1],
                'altitude_location' => $t[2],
                'cost_per_night'    => $t[3],
                'has_electricity'   => $t[4],
                'has_wifi'          => $t[5],
                'route_days_id'     => $t[6],
                'tea_house_images'  => null,
                'created_at'        => $now,
                'updated_at'        => $now,
            ];
        }

        DB::table('tea_houses')->insert($teaHouseData);

        // ── 5. KNOWLEDGE BASE ─────────────────────────────────────────────────
        $kb = [
            // Altitude sickness
            [
                'trekking_route_id' => null,
                'title'             => 'Altitude Sickness (AMS) — Prevention and Treatment',
                'content'           => 'Acute Mountain Sickness (AMS) is the most common medical problem on Nepal treks. It occurs when you ascend too fast and your body cannot acclimatize to reduced oxygen levels. Symptoms include headache, nausea, dizziness, fatigue, and loss of appetite. The golden rule is: climb high, sleep low. Never ascend more than 300–500m per day above 3,000m. Rest days are mandatory, not optional. Drink 3–4 litres of water daily. Avoid alcohol and sleeping pills at high altitude as they suppress breathing. Diamox (Acetazolamide) 125–250mg twice daily can help prevent AMS — consult a doctor before your trek. If symptoms worsen or you develop HACE (High Altitude Cerebral Edema — confusion, loss of coordination) or HAPE (High Altitude Pulmonary Edema — breathlessness at rest, coughing blood), descend immediately. Descent is the only cure. The Himalayan Rescue Association has clinics in Pheriche (EBC route) and Manang (Annapurna Circuit) that offer free altitude sickness talks. NEVER ascend if you have symptoms.',
                'category'          => 'Health & Safety',
                'source'            => 'Trek-Sathi Medical Guide',
            ],
            // Permits
            [
                'trekking_route_id' => null,
                'title'             => 'Nepal Trekking Permits — Complete Guide 2025',
                'content'           => 'All foreign trekkers in Nepal require the following permits depending on the region: 1) TIMS Card (Trekkers Information Management System) — NRs 2,000 for individual trekkers, NRs 1,000 for group trekkers. Required for most trekking areas. 2) Sagarmatha National Park Permit — NRs 3,000 per person. Required for EBC and all Khumbu treks. Purchase at the Nepal Tourism Board office in Kathmandu or at the Monjo park gate. 3) ACAP (Annapurna Conservation Area Permit) — NRs 3,000 per person. Required for Annapurna Circuit, ABC, and Poon Hill treks. 4) Langtang National Park Permit — NRs 3,000 per person. Required for all Langtang treks. 5) Manaslu Restricted Area Permit — $100 USD per week (Sep–Nov), $75 USD (other seasons). Minimum group of 2 required. Licensed guide mandatory. 6) Upper Mustang Restricted Area Permit — $500 USD for 10 days, $50 USD per day thereafter. Group of 2 minimum, licensed guide mandatory. TIMS cards are obtained from the Nepal Tourism Board (Pradarshani Marg, Kathmandu) or the Trekking Agents Association of Nepal (TAAN). Always carry passport-size photos (4 copies) for permit applications. Check current prices as they change annually.',
                'category'          => 'Permits & Regulations',
                'source'            => 'Nepal Tourism Board 2025',
            ],
            // Best seasons
            [
                'trekking_route_id' => null,
                'title'             => 'Best Trekking Seasons in Nepal',
                'content'           => 'Nepal has four trekking seasons. Autumn (September–November) is the best season with stable weather, clear mountain views, and moderate temperatures. October is peak season — book accommodation and flights to Lukla well in advance. Spring (March–May) is the second best season with rhododendron blooms and good visibility. April is ideal. Temperature is warmer than autumn. Monsoon (June–August) — heavy rainfall, leeches on lower trails, and poor visibility. However, Upper Mustang and Dolpo (rain shadow areas) are excellent in monsoon. Winter (December–February) — cold with possible snowfall above 3,000m. High passes like Thorong La and Larkya La may be closed. Lower elevation treks like Annapurna Base Camp approach, Ghorepani-Poon Hill, and Langtang (to 4,000m) are possible. Clear winter skies can offer spectacular views. Lukla flights are most reliable in September-October and April-May. Weather can change rapidly in the mountains — always carry rain gear, warm layers, and a windproof jacket regardless of season.',
                'category'          => 'Planning',
                'source'            => 'Trek-Sathi Seasonal Guide',
            ],
            // Gear packing list
            [
                'trekking_route_id' => null,
                'title'             => 'Essential Gear and Packing List for Nepal Treks',
                'content'           => 'Essential gear for a Nepal trek: Footwear: broken-in waterproof trekking boots (critical — never use new boots), trekking poles, gaiters for snow/mud. Clothing: moisture-wicking base layers, fleece mid-layer, down jacket (-20°C rated for high treks), waterproof shell jacket and pants, trekking trousers (2–3 pairs), thermal underwear, wool or synthetic trekking socks (6+ pairs), warm hat and sun hat, gloves (light and warm), neck gaiter. Sleeping: sleeping bag (-15°C to -20°C for EBC/Circuit, -10°C for lower treks). Bag: 45–60L backpack with rain cover, small daypack (20–30L) for daily use. Navigation/Safety: detailed trekking map, headlamp with spare batteries, whistle, small mirror. Medical: personal first aid kit, Diamox (prescription), Ibuprofen, Paracetamol, rehydration salts, blister treatment (Compeed), antiseptic cream, altitude sickness medication, water purification tablets or filter. Sun protection: SPF 50+ sunscreen, UV-blocking sunglasses (glacier glasses above 4,000m), lip balm with SPF. Documents: passport, TIMS card, national park permits, travel insurance documents, emergency contact list. Electronics: phone with offline maps (Maps.me or AllTrails downloaded), portable power bank, universal adapter. Optional: book, playing cards, journal. Total backpack weight (without water): aim for under 10kg. Hire a porter if over 15kg — NRs 800–1,500/day plus accommodation and food.',
                'category'          => 'Gear & Equipment',
                'source'            => 'Trek-Sathi Gear Guide',
            ],
            // EBC specific KB
            [
                'trekking_route_id' => $routeIds['Everest Base Camp Trek'],
                'title'             => 'Everest Base Camp Trek — Complete Trekker\'s Guide',
                'content'           => 'The Everest Base Camp trek is 130km round trip from Lukla, taking 12–16 days. Total elevation gain: approximately 4,000m. The trek is graded hard due to altitude, not technical difficulty. No climbing equipment needed. Fitness requirement: ability to walk 6–8 hours per day on uneven terrain. Training: cardio (running, cycling) for 3 months before. Lukla flights: 35 minutes from Kathmandu, operated by Tara Air and Summit Air. Cost: $200–250 USD per person return. Flights are frequently delayed or cancelled due to weather. Always have 2–3 buffer days in your itinerary. Alternative: drive/fly to Phaplu and trek for 4–5 extra days. Cost breakdown: Lukla flights $200–250, permits $60, guide $30–40/day, porter $20–25/day, accommodation $5–20/night, food $15–30/day. Total budget: $1,500–2,500 USD for 14 days excluding international flights. Namche Bazaar has ATMs but they frequently run out of cash — bring sufficient NPR or USD from Kathmandu. There are no ATMs above Namche. Mobile network (NCell/Nepal Telecom) works intermittently. WiFi available at most lodges for $1–3/session or included in lodge price. Emergency helicopter rescue is available but costs $3,000–6,000 USD — comprehensive travel insurance with helicopter evacuation cover is mandatory.',
                'category'          => 'Route Guide',
                'source'            => 'Trek-Sathi EBC Guide',
            ],
            // Annapurna Circuit KB
            [
                'trekking_route_id' => $routeIds['Annapurna Circuit Trek'],
                'title'             => 'Annapurna Circuit — Thorong La Pass Crossing Guide',
                'content'           => 'The Thorong La Pass (5,416m) is the highest point of the Annapurna Circuit and its most critical section. The pass is typically open from late September to mid-December and March to May. It can be closed due to snowfall — check conditions with lodge owners in Manang before attempting. Start time: depart Thorong Phedi or High Camp between 3:00–5:00am to reach the pass before afternoon winds (which can reach 80km/h). Distance from Thorong Phedi to Muktinath: 18km. Elevation gain: 991m (from Phedi) or 491m (from High Camp). Average crossing time: 5–8 hours total. The pass is marked by prayer flags and cairns. DO NOT attempt if you have AMS symptoms — turn back immediately. The descent to Muktinath is steep and icy in early morning. Use trekking poles. Bring: warm layers (it can be -15°C at the top), snacks, thermos of hot tea, headlamp, sunglasses. There is a teahouse at the pass summit. Once you descend into Mustang district, there are no rescue options until Muktinath.',
                'category'          => 'Route Guide',
                'source'            => 'Trek-Sathi Annapurna Guide',
            ],
            // Porter and guide guide
            [
                'trekking_route_id' => null,
                'title'             => 'Hiring Guides and Porters in Nepal',
                'content'           => 'Hiring a local guide and/or porter is strongly recommended for all Nepal treks and is mandatory for restricted areas (Manaslu, Upper Mustang, Dolpo). Benefits: route knowledge, cultural insights, language help, safety partner, emergency assistance, and supporting the local economy. Guide rates: $30–50 USD per day (includes accommodation and food). Porter rates: $20–30 USD per day (includes accommodation, food, and insurance — required by law). Porters can carry 25–30kg maximum. Never overload porters — this is unethical and illegal. Porter load should not exceed 25kg plus their own personal gear. Hire through registered trekking agencies (TAAN members) for accountability. Ask to see guide license and porter insurance. Tips are customary and appreciated: $5–10 USD per day for good service. The International Porter Protection Group (IPPG) sets standards for ethical treatment of porters. Ensure your porter has: appropriate clothing for the altitude, proper footwear, their own sleeping bag, and medical insurance. TIMS card: individual trekkers get TIMS for NRs 2,000; trekkers with a licensed guide get group TIMS for NRs 1,000 (saving NRs 1,000).',
                'category'          => 'Planning',
                'source'            => 'Trek-Sathi Planning Guide',
            ],
            // Manaslu
            [
                'trekking_route_id' => $routeIds['Manaslu Circuit Trek'],
                'title'             => 'Manaslu Circuit — Larkya La Pass and Permit Guide',
                'content'           => 'The Manaslu Circuit is a restricted trekking area requiring special permits. Required documents: 1) Manaslu Restricted Area Permit — $100 USD/week (September–November), $75 USD/week (December–August). 2) Manaslu Conservation Area Permit — NRs 3,000. 3) TIMS Card. 4) Annapurna Conservation Area Permit (NRs 3,000) for the Dharapani section. Minimum group: 2 trekkers. Licensed guide: mandatory (IPPG certified). The Larkya La Pass (5,160m): best crossed October–November and March–April. Start from Samdo or Dharamsala (4,460m) at 3–4am. Crossing takes 7–9 hours. The pass can have deep snow in early season. Crampons and ice axe may be needed October and April. Descent to Bimthang is steep with moraine trail. Key villages: Soti Khola (start), Namrung (3,700m, ancient monastery), Lho (3,180m, views of Manaslu), Samagaon (3,530m, last major village before pass), Samdo (3,690m, acclimatization point), Dharamsala/Larkya Base Camp (4,460m, basic teahouses). Budget: $60–80 USD/day all-inclusive. Total: $900–1,300 USD for 16 days plus international flights. The circuit connects to the Annapurna Circuit at Dharapani, allowing an extended combined trek.',
                'category'          => 'Route Guide',
                'source'            => 'Trek-Sathi Manaslu Guide',
            ],
        ];

        $kbData = [];
        foreach ($kb as $k) {
            $kbData[] = [
                'trekking_route_id' => $k['trekking_route_id'],
                'title'             => $k['title'],
                'content'           => $k['content'],
                'category'          => $k['category'],
                'source'            => $k['source'],
                'is_indexed'        => false,
                'created_at'        => $now,
                'updated_at'        => $now,
            ];
        }

        DB::table('knowledge_bases')->insert($kbData);

        $this->command->info('✅ Regions: ' . DB::table('regions')->count());
        $this->command->info('✅ Trekking Routes: ' . DB::table('trekking_routes')->count());
        $this->command->info('✅ Route Days: ' . DB::table('route_days')->count());
        $this->command->info('✅ Tea Houses: ' . DB::table('tea_houses')->count());
        $this->command->info('✅ Knowledge Base: ' . DB::table('knowledge_bases')->count());
        $this->command->info('');
        $this->command->info('Now run: php artisan kb:index');
    }
}
