import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

export default function MessagePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the conversation data based on the ID
  const conversation = {
    id: params.id,
    with: {
      id: "john-doe",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
    },
    artwork: {
      id: "forest-scene",
      title: "Forest Scene",
      image: "/placeholder.svg?height=40&width=40&text=Forest",
    },
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Forest Scene painting",
        time: "4:39 am",
      },
      {
        id: 2,
        sender: "you",
        text: "Forest painting price?",
        time: "11:07 am",
      },
      {
        id: 3,
        sender: "them",
        text: "Can you pick up a pickup?",
        time: "1:23 pm",
      },
    ],
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <header className="p-4 flex items-center border-b">
        <Link href="/messages" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">{conversation.with.name}</h1>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="flex items-center p-2 bg-gray-100 rounded-lg">
          <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
            <img
              src={conversation.artwork.image || "/placeholder.svg"}
              alt={conversation.artwork.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{conversation.with.name}</p>
            <p className="text-xs text-gray-500">Aparescent tadi...</p>
          </div>
        </div>

        {conversation.messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "you" ? "bg-blue-500 text-white rounded-tr-none" : "bg-gray-100 rounded-tl-none"
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "you" ? "text-blue-100" : "text-gray-500"}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex items-center">
        <input type="text" placeholder="Message..." className="flex-1 border rounded-full py-2 px-4 mr-2" />
        <button className="bg-blue-500 text-white rounded-full p-2">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
