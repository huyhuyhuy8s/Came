import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function SupportButton() {
  const navigate = useNavigate()

  return (
    <Button 
      variant="outline"
      onClick={() => navigate('/support')}
      className="w-full"
    >
      Create Support Ticket
    </Button>
  )
}