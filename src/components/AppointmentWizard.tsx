import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, MapPin, User, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Step = "address" | "newClient" | "date" | "time" | "confirm";

const EXAMPLE_ADDRESS = "Calle Principal #123, Centro";

const generateRandomTimeSlots = () => {
  const slots = [];
  const hours = [9, 10, 11, 14, 15, 16, 17];
  const usedSlots = new Set<string>();
  
  while (slots.length < 6 && usedSlots.size < hours.length) {
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const minute = Math.random() < 0.5 ? "00" : "30";
    const timeSlot = `${hour.toString().padStart(2, "0")}:${minute}`;
    
    if (!usedSlots.has(timeSlot)) {
      usedSlots.add(timeSlot);
      slots.push(timeSlot);
    }
  }
  
  return slots.sort();
};

export const AppointmentWizard = () => {
  const [currentStep, setCurrentStep] = useState<Step>("address");
  const [canGoToAddress, setCanGoToAddress] = useState<boolean | null>(null);
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots] = useState<string[]>(generateRandomTimeSlots());

  const handleAddressResponse = (canGo: boolean) => {
    setCanGoToAddress(canGo);
    setCurrentStep("newClient");
  };

  const handleClientTypeResponse = (isNew: boolean) => {
    setIsNewClient(isNew);
    setCurrentStep("date");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setCurrentStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      toast({
        title: "¡Cita agendada!",
        description: `Tu cita ha sido confirmada para el ${format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })} a las ${selectedTime}.`,
      });
      
      // Reset the wizard
      setCurrentStep("address");
      setCanGoToAddress(null);
      setIsNewClient(null);
      setSelectedDate(undefined);
      setSelectedTime(null);
    }
  };

  const getStepNumber = () => {
    const steps = ["address", "newClient", "date", "time"];
    return steps.indexOf(currentStep) + 1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-soft)] p-4">
      <Card className="w-full max-w-2xl shadow-[var(--shadow-card)] border-border/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-3xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
              Agendar Cita
            </CardTitle>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    step <= getStepNumber()
                      ? "bg-primary shadow-[var(--shadow-soft)]"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardDescription className="text-base">
            {currentStep === "address" && "Primero, confirmemos tu ubicación"}
            {currentStep === "newClient" && "¿Es tu primera vez con nosotros?"}
            {currentStep === "date" && "Consulta personalizada - Selecciona una fecha"}
            {currentStep === "time" && "Elige tu horario preferido"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: Address */}
          {currentStep === "address" && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-2">¿Puedes dirigirte a:</p>
                  <p className="text-muted-foreground">{EXAMPLE_ADDRESS}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="wizard"
                  size="lg"
                  onClick={() => handleAddressResponse(true)}
                  className="flex-1"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Sí, puedo ir
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAddressResponse(false)}
                  className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                >
                  No puedo
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: New Client */}
          {currentStep === "newClient" && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <User className="h-6 w-6 text-secondary" />
                <p className="font-semibold text-lg">¿Eres cliente nuevo?</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleClientTypeResponse(true)}
                  className="flex-1"
                >
                  Sí, soy nuevo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleClientTypeResponse(false)}
                  className="flex-1"
                >
                  Ya soy cliente
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Date Selection */}
          {currentStep === "date" && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-4">
                <CalendarIcon className="h-6 w-6 text-accent" />
                <p className="font-semibold text-lg">Selecciona la fecha de tu cita</p>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="rounded-md border shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Step 4: Time Selection */}
          {currentStep === "time" && selectedDate && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Horarios disponibles</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleTimeSelect(slot)}
                    className="h-14"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
              {selectedTime && (
                <Button
                  variant="wizard"
                  size="lg"
                  onClick={handleConfirm}
                  className="w-full mt-6"
                >
                  <Check className="mr-2 h-5 w-5" />
                  Agendar Cita
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
