import { useNavigate } from "react-router-dom"
import Button from "../components/Button";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1 w-full flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#81b64c] to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={"./public/chessboard.png"} 
              alt="Chess Board" 
              className="relative rounded-lg shadow-2xl w-full max-w-lg object-cover transform transition-transform duration-500 hover:scale-[1.02]" 
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500 mb-6">
            Master <br/> Chess.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-md">
            Play real-time multiplayer chess with a fast, modern, and beautiful interface.
          </p>
          <div className="w-full md:w-auto">
            <Button onClick={() => navigate('/game')}>
              Play Online Now
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Landing