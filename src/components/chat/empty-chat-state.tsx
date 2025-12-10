"use client"

const EmptyChatState = () => {
  return (
    <div className="w-1/2 md:flex-1 flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-700">No chats yet</h2>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">Start a conversation from a listing</p>
    </div>
  )
}

export default EmptyChatState
