<?php

namespace App\Http\Controllers\User;

use App\AI\TrekSathiAgent;
use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatApiController extends Controller
{
    public function __construct(private readonly TrekSathiAgent $agent) {}

    /**
     * Post /api/chat
     * Accepts message, session_id and streams the assistant reply back as server sent events
     * data: {"type":"chunk","text":"…"}
     * data: {"type":"done","session_id":42}
     * data: {"type":"error","message":"…"}
     */

    public function stream(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'message'=>'required|string|max:4000',
            'session_id'=>'nullable|integer',
        ]);

        $user=Auth::user();
        $message=trim($validated['message']);

        //create or resolve chat session
        $session=$this->resolveSession($user->id, $validated['session_id'] ?? null);

        //save user message immediately
        ChatMessage::create([
            'chat_session_id'=>$session->id,
            'role'=>'user',
            'content'=>$message,
        ]);

        //Auto title on first message
        if($session->title === 'New Chat' && $session->messages()->count() === 1){
            $title=$this->agent->generateTitle($message);
            if($title){
                $session->update(['title'=>$title]);
            }
        }


        //Stream response
        $response=new StreamedResponse(function () use ($session, $message){
            $fullResponse = '';
            $this->agent->streamResponse(
                userMessage:$message,
                session:$session,
                onChunk:function (string $chunk) use (&$fullResponse){
                    $fullResponse .=$chunk;
                    $this->sendSseEvent('chunk',['text'=>$chunk]);
                },
                onDone: function (string $full) use ($session, &$fullResponse){
                    ChatMessage::create([
                        'chat_session_id'=>$session->id,
                        'role'=>'assistant',
                        'content'=>$full,
                    ]);

                    $this->sendSseEvent('done',['session_id'=>$session->id]);
                }
            );
        });

        $response->headers->set('Content-Type','text/event-stream');
        $response->headers->set('Cache-Control','no-cache');
        $response->headers->set('X-Accel-Buffering','no'); //nedded for nginx
        $response->headers->set('Connection','keep-alive');

        return $response;
    }

    //get /api/chat/history/{session}
    public function history(int $sessionId): \Illuminate\Http\JsonResponse
    {
        $session=ChatSession::where('id',$sessionId)
            ->where('user_id',Auth::id())
            ->firstOrFail();

        $messages=$session->messages()
            ->select('id','role','content','created_at')
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'session'=>[
                'id'=>$session->id,
                'title'=>$session->title,
            ],
            'messages'=>$messages,
        ]);
    }

    //Helper functons
    private function resolveSession(int $userId, ?int $sessionId)//: ChatSession
    {
        if($sessionId){
            $session=ChatSession::where('id',$sessionId)
                ->where('user_id',$userId)
                ->first();

            if($session){
                return $session;
            }

            return ChatSession::create([
                'user_id'=>$userId,
                'title'=>'New Chat',
            ]);
        }
    }

    //write a single server sent evernt (SSE) and flush output buffer
    private function sendSseEvent(string $type, array $data): void
    {
        $payload=json_encode(['type'=>$type, ...$data]);
        echo "data: {$payload}\n\n";

        if(ob_get_level()>0){
            ob_flush();
        }

        flush();
    }
}
