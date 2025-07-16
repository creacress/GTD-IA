export default function NeonDivider() {
    return (
      <div className="relative w-full my-16 flex justify-center">
        <div className="w-[80%] max-w-4xl h-1 bg-[#00e0ff66] rounded-full relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-[#00e0ff] blur-md opacity-80 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }
  