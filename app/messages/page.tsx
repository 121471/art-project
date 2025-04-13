import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
  const conversations = [
    {
      id: 1,
      with: {
        id: "john-doe",
        name: "John Doe",
        avatar: "/placeholder.svg?height=50&width=50&text=JD",
      },
      lastMessage: {
        text: "Can you pick up a pickup?",
        time: "1:23 pm",
        isRead: true,
      },
    },
    {
      id: 2,
      with: {
        id: "jane-smith",
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=50&width=50&text=JS",
      },
      lastMessage: {
        text: "I'm interested in your abstract painting",
        time: "Yesterday",
        isRead: false,
      },
    },
    {
      id: 3,
      with: {
        id: "alice-johnson",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=50&width=50&text=AJ",
      },
      lastMessage: {
        text: "Is the sculpture still available?",
        time: "2 days ago",
        isRead: true,
      },
    },
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <header className="p-4 flex items-center border-b">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Messages</h1>
      </header>

      <div className="flex-1 overflow-auto">
        {conversations.map((conversation) => (
          <Link href={`/messages/${conversation.id}`} key={conversation.id} className="flex items-center p-4 border-b">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <img
                src={conversation.with.avatar || "/placeholder.svg"}
                alt={conversation.with.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{conversation.with.name}</h3>
                <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
              </div>
              <p className={`text-sm ${conversation.lastMessage.isRead ? "text-gray-500" : "font-semibold"}`}>
                {conversation.lastMessage.text}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
