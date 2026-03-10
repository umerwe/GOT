const Loader = () => {
  return (
    <div 
    className="flex justify-center items-center"
    style={{ minHeight: "calc(100vh - 200px)" }}
    >
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export const SpinnerLoader = ({className}: {className?: string}) => {
  return (
    <div
      className={`border-3 border-gray-200 border-t-solid rounded-full animate-spin w-6 h-6 ${className}`}
    />
  )
}

export default Loader
