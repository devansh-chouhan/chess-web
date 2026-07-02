import { useNavigate } from "react-router-dom"
import Button from "../components/Button";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-row justify-center gap-10 p-10 bg-gray-900 text-white">
      <div className="mt-10 pr-20">
        <img src={"./public/chessboard.png"} className="h-100 w-100" />
      </div>
      <div className="pt-20 w-1/2">
        <h1 className="text-4xl font-bold">Master Chess.</h1>
        <p className="mb-10 text-xl">Play real-time multiplayer chess with a fast,
          modern interface.</p>
        <Button onClick={() => {
          navigate('/game')
        }}>Play Online</Button>
      </div>
    </div>
  )
}

export default Landing