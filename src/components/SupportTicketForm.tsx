import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createSupportTicket } from "@/services/supportService"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

export function SupportTicketForm() {
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const resetForm = () => {
    setDescription("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate minimum length
    if (description.trim().length < 10) {
      toast({
        title: "Validation Error",
        description: "Please provide a more detailed description (minimum 10 characters)",
        variant: "destructive"
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please login to create a support ticket",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createSupportTicket({
        user_id: user.id,
        issue_description: description.trim(),
        status: 'open'
      })
      
      toast({
        title: "Success",
        description: "Support ticket created successfully. We'll respond shortly.",
      })
      resetForm()
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create support ticket"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      console.error("Support ticket creation error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Issue Description</Label>
        <Textarea
          id="description"
          placeholder="Please describe your issue in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[150px]"
          disabled={isSubmitting}
          required
        />
        <p className="text-sm text-muted-foreground">
          {description.length < 10 
            ? `${10 - description.length} more characters needed` 
            : `${description.length} characters`}
        </p>
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting || description.length < 10}
        className="w-full"
      >
        {isSubmitting ? "Creating Ticket..." : "Submit Support Ticket"}
      </Button>
    </form>
  )
}