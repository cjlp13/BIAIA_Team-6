"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays, isBefore, isToday, parseISO } from "date-fns"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  location: string
  notes: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null)
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "obgyn",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    location: "",
    notes: "",
  })

  // Load appointments from localStorage on initial render
  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments")
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    } else {
      // Add sample appointments if none exist
      const sampleAppointments: Appointment[] = [
        {
          id: "1",
          doctorName: "Dr. Sarah Johnson",
          specialty: "obgyn",
          date: format(addDays(new Date(), 7), "yyyy-MM-dd"),
          time: "10:00",
          location: "Women's Health Clinic, 123 Main St",
          notes: "Regular checkup and ultrasound",
        },
        {
          id: "2",
          doctorName: "Dr. Michael Chen",
          specialty: "nutrition",
          date: format(addDays(new Date(), 14), "yyyy-MM-dd"),
          time: "14:30",
          location: "Wellness Center, 456 Oak Ave",
          notes: "Nutrition consultation",
        },
      ]
      setAppointments(sampleAppointments)
      localStorage.setItem("appointments", JSON.stringify(sampleAppointments))
    }
  }, [])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments))
  }, [appointments])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAppointment = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
    }

    setAppointments((prev) => [...prev, newAppointment])
    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditAppointment = () => {
    if (!currentAppointment) return

    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === currentAppointment.id ? { ...formData, id: currentAppointment.id } : appointment,
    )

    setAppointments(updatedAppointments)
    resetForm()
    setIsEditDialogOpen(false)
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
  }

  const openEditDialog = (appointment: Appointment) => {
    setCurrentAppointment(appointment)
    setFormData({
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      notes: appointment.notes,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      doctorName: "",
      specialty: "obgyn",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:00",
      location: "",
      notes: "",
    })
    setCurrentAppointment(null)
  }

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Filter upcoming appointments (today and future)
  const upcomingAppointments = sortedAppointments.filter((appointment) => {
    const appointmentDate = parseISO(appointment.date)
    return isToday(appointmentDate) || isBefore(new Date(), appointmentDate)
  })

  // Filter past appointments
  const pastAppointments = sortedAppointments.filter((appointment) => {
    const appointmentDate = parseISO(appointment.date)
    return !isToday(appointmentDate) && isBefore(appointmentDate, new Date())
  })

  // Get the next appointment
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null

  // Format date for display
  const formatAppointmentDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, "MMMM d, yyyy")
  }

  // Get specialty display name
  const getSpecialtyName = (specialty: string) => {
    const specialties: Record<string, string> = {
      obgyn: "OB/GYN",
      nutrition: "Nutritionist",
      pediatric: "Pediatrician",
      midwife: "Midwife",
      other: "Other Specialist",
    }
    return specialties[specialty] || specialty
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-3">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-semibold">Appointments</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full">
                  <Plus className="w-4 h-4 mr-1" /> Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Appointment</DialogTitle>
                  <DialogDescription>Schedule a new doctor's appointment</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Doctor's Name</Label>
                      <Input
                        id="doctorName"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        placeholder="Dr. Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select
                        value={formData.specialty}
                        onValueChange={(value) => handleSelectChange("specialty", value)}
                      >
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="obgyn">OB/GYN</SelectItem>
                          <SelectItem value="nutrition">Nutritionist</SelectItem>
                          <SelectItem value="pediatric">Pediatrician</SelectItem>
                          <SelectItem value="midwife">Midwife</SelectItem>
                          <SelectItem value="other">Other Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={format(new Date(), "yyyy-MM-dd")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Clinic name and address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Reason for visit, questions to ask, etc."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAppointment}>Add Appointment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Next Appointment Card */}
        {nextAppointment ? (
          <Card className="border-l-4 border-l-pink-600">
            <CardHeader className="pb-2">
              <CardTitle>Next Appointment</CardTitle>
              <CardDescription>Your upcoming doctor's visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{formatAppointmentDate(nextAppointment.date)}</h3>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="inline-block w-3 h-3 mr-1" />
                      {nextAppointment.time}
                    </p>
                  </div>
                </div>
                <Badge className="mt-2 md:mt-0">{getSpecialtyName(nextAppointment.specialty)}</Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">{nextAppointment.doctorName}</h3>
                <p className="text-sm flex items-start">
                  <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>{nextAppointment.location}</span>
                </p>
                {nextAppointment.notes && (
                  <p className="text-sm bg-muted p-2 rounded-md mt-2">{nextAppointment.notes}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(nextAppointment)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteAppointment(nextAppointment.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No upcoming appointments</AlertTitle>
            <AlertDescription>
              You don't have any scheduled appointments. Click "Add Appointment" to schedule your next checkup.
            </AlertDescription>
          </Alert>
        )}

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.slice(1).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mt-1">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{appointment.doctorName}</h3>
                        <Badge className="ml-2" variant="outline">
                          {getSpecialtyName(appointment.specialty)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatAppointmentDate(appointment.date)} at {appointment.time}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-start mt-1">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{appointment.location}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3 md:mt-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(appointment)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Your previous visits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0 opacity-70"
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-muted p-2 rounded-full mt-1">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{appointment.doctorName}</h3>
                        <Badge className="ml-2" variant="outline">
                          {getSpecialtyName(appointment.specialty)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatAppointmentDate(appointment.date)} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive mt-3 md:mt-0"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update your appointment details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-doctorName">Doctor's Name</Label>
                <Input
                  id="edit-doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  placeholder="Dr. Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialty">Specialty</Label>
                <Select value={formData.specialty} onValueChange={(value) => handleSelectChange("specialty", value)}>
                  <SelectTrigger id="edit-specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obgyn">OB/GYN</SelectItem>
                    <SelectItem value="nutrition">Nutritionist</SelectItem>
                    <SelectItem value="pediatric">Pediatrician</SelectItem>
                    <SelectItem value="midwife">Midwife</SelectItem>
                    <SelectItem value="other">Other Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Clinic name and address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Reason for visit, questions to ask, etc."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAppointment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNavigation activeItem="home" />
    </div>
  )
}
