import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, MapPin, User, Clock, Globe, Sun, Moon, Phone, UserCheck, ChevronLeft, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Step, Language } from "@/types/appointment";
import { translations } from "@/i18n/translations";
import { EXAMPLE_ADDRESS, generateRandomTimeSlots, COMPANY_NAME, COMPANY_PHONE, generateWhatsAppLink } from "@/utils/appointment";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { appointmentService, AppointmentRequest } from "@/services/api";

export const AppointmentWizard = () => {
  const [currentStep, setCurrentStep] = useState<Step>("address");
  const [canGoToAddress, setCanGoToAddress] = useState<boolean | null>(null);
  const [isNewClient, setIsNewClient] = useState<boolean | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots] = useState<string[]>(generateRandomTimeSlots());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState<boolean>(false);
  
  // Usar localStorage para persistir idioma y tema
  const [language, setLanguage] = useLocalStorage<Language>("calendar-language", "es");
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("calendar-theme", false);

  // Aplicar tema al cargar y cuando cambie
  useEffect(() => {
    // Si no hay valor guardado, detectar preferencia del sistema
    if (localStorage.getItem("calendar-theme") === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    // Aplicar el tema actual
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, setIsDarkMode]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "es" ? "en" : "es");
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleWhatsAppClick = () => {
    if (COMPANY_PHONE) {
      const whatsappUrl = generateWhatsAppLink(COMPANY_PHONE);
      window.open(whatsappUrl, '_blank');
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remover espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    
    // Verificar que solo contenga números y posiblemente un + al inicio
    const phoneRegex = /^(\+?[1-9]\d{1,14})$/;
    
    // Debe tener entre 7 y 15 dígitos (estándar internacional)
    const lengthValid = cleanPhone.replace(/^\+/, '').length >= 7 && cleanPhone.replace(/^\+/, '').length <= 15;
    
    return phoneRegex.test(cleanPhone) && lengthValid;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remover todo excepto números y +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Si comienza con +, mantenerlo
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Para números sin código de país, formatear como número local
    const numbers = cleaned.replace(/\D/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "newClient":
        setCurrentStep("address");
        break;
      case "contact":
        setCurrentStep("newClient");
        break;
      case "date":
        setCurrentStep("contact");
        break;
      case "time":
        setCurrentStep("date");
        break;
      default:
        break;
    }
  };

  const handleContactSubmit = () => {
    let hasErrors = false;
    
    // Validar nombre
    if (!name.trim()) {
      setNameError(t.contact.nameRequired);
      hasErrors = true;
    } else {
      setNameError("");
    }
    
    // Validar teléfono
    if (!phone.trim()) {
      setPhoneError(t.contact.phoneRequired);
      hasErrors = true;
    } else if (!validatePhoneNumber(phone)) {
      setPhoneError(t.contact.phoneInvalid);
      hasErrors = true;
    } else {
      setPhoneError("");
    }
    
    if (!hasErrors) {
      setCurrentStep("date");
    }
  };

  const t = translations[language];
  const locale = language === "es" ? es : enUS;

  const handleAddressResponse = (canGo: boolean) => {
    setCanGoToAddress(canGo);
    setCurrentStep("newClient");
  };

  const handleClientTypeResponse = (isNew: boolean) => {
    setIsNewClient(isNew);
    setCurrentStep("contact");
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

  const handleConfirm = async () => {
    if (selectedDate && selectedTime && name && phone) {
      setIsSubmitting(true);
      
      try {
        // Crear el objeto de fecha y hora
        const appointmentDateTime = new Date(selectedDate);
        const [hours, minutes] = selectedTime.split(':');
        appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Calcular hora de fin (asumiendo 1 hora de duración)
        const endDateTime = new Date(appointmentDateTime);
        endDateTime.setHours(endDateTime.getHours() + 1);
        
        // Preparar los datos para la API
        const appointmentData: AppointmentRequest = {
          client_name: name.trim(),
          phone_number: phone.trim(),
          service_type: isNewClient ? "Consulta - Cliente Nuevo" : "Consulta - Cliente Existente",
          start_time: appointmentDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          additional_notes: `Dirección confirmada: ${canGoToAddress ? "Sí" : "No"}. Idioma preferido: ${language}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        };
        
        // Enviar a la API
        await appointmentService.createAppointment(appointmentData);
        
        // Mostrar mensaje de éxito
        const dateFormat = language === "es" 
          ? "d 'de' MMMM 'de' yyyy" 
          : "MMMM d, yyyy";
        
        const formattedDate = format(selectedDate, dateFormat, { locale });
        
        toast({
          title: t.toast.title,
          description: t.toast.description
            .replace("{date}", formattedDate)
            .replace("{time}", selectedTime),
        });
        
        // Mostrar pantalla de confirmación
        setIsAppointmentBooked(true);
        
      } catch (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: t.toast.error,
          description: t.toast.errorDescription,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getStepNumber = () => {
    const steps = ["address", "newClient", "contact", "date", "time"];
    return steps.indexOf(currentStep) + 1;
  };

  const handleNewAppointment = () => {
    // Reset the wizard
    setCurrentStep("address");
    setCanGoToAddress(null);
    setIsNewClient(null);
    setName("");
    setPhone("");
    setNameError("");
    setPhoneError("");
    setSelectedDate(undefined);
    setSelectedTime(null);
    setIsAppointmentBooked(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-soft)] p-4">
      <Card className="w-full max-w-2xl shadow-[var(--shadow-card)] border-border/50 relative">
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                {language === "es" ? "Agendando tu cita..." : "Scheduling your appointment..."}
              </p>
            </div>
          </div>
        )}
        
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wider">
                  {COMPANY_NAME}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWhatsAppClick}
                  className="h-6 w-6 p-0 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  title="Contactar por WhatsApp"
                  disabled={isSubmitting}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  {language === "es" ? "EN" : "ES"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  {isDarkMode ? (
                    <Sun className="h-3 w-3" />
                  ) : (
                    <Moon className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentStep !== "address" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousStep}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
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
          </div>
          <CardDescription className="text-base">
            {currentStep === "address" && t.stepDescriptions.address}
            {currentStep === "newClient" && t.stepDescriptions.newClient}
            {currentStep === "contact" && t.stepDescriptions.contact}
            {currentStep === "date" && t.stepDescriptions.date}
            {currentStep === "time" && t.stepDescriptions.time}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Pantalla de confirmación */}
          {isAppointmentBooked ? (
            <div className="space-y-8 animate-in fade-in-50 duration-500 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {t.confirmation.title}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {t.confirmation.message}
                  </p>
                </div>
              </div>
              
              {selectedDate && selectedTime && (
                <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg mb-4">{t.confirmation.details}</h3>
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>
                      {format(selectedDate, language === "es" ? "EEEE, d 'de' MMMM 'de' yyyy" : "EEEE, MMMM d, yyyy", { locale })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    <span>{name}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleNewAppointment}
                  className="w-full"
                >
                  {t.confirmation.newAppointment}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {t.confirmation.whatsappMessage}
                </div>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWhatsAppClick}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
              </div>
            </div>
          ) : (
            <>
          {/* Step 1: Address */}
          {currentStep === "address" && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-lg mb-2">{t.address.question}</p>
                  <p className="text-muted-foreground">{EXAMPLE_ADDRESS}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="wizard"
                  size="lg"
                  onClick={() => handleAddressResponse(true)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Check className="mr-2 h-5 w-5" />
                  {t.address.canGo}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAddressResponse(false)}
                  className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  disabled={isSubmitting}
                >
                  {t.address.cantGo}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: New Client */}
          {currentStep === "newClient" && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <User className="h-6 w-6 text-secondary" />
                <p className="font-semibold text-lg">{t.client.question}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleClientTypeResponse(true)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {t.client.newClient}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleClientTypeResponse(false)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {t.client.existingClient}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === "contact" && (
            <div className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <UserCheck className="h-6 w-6 text-primary" />
                <p className="font-semibold text-lg">{t.contact.title}</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.contact.nameLabel}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.contact.namePlaceholder}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    className={nameError ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {nameError && (
                    <p className="text-sm text-destructive">{nameError}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.contact.phoneLabel}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t.contact.phonePlaceholder}
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Permitir solo números, espacios, guiones, paréntesis y +
                        const filteredValue = value.replace(/[^0-9\s\-()+ ]/g, '');
                        setPhone(filteredValue);
                        
                        // Limpiar errores si el usuario está escribiendo
                        if (phoneError) {
                          setPhoneError("");
                        }
                      }}
                      onBlur={() => {
                        // Validar cuando el usuario salga del campo
                        if (phone.trim() && !validatePhoneNumber(phone)) {
                          setPhoneError(t.contact.phoneInvalid);
                        }
                      }}
                      className={`pl-10 ${phoneError ? "border-destructive" : ""}`}
                      maxLength={20}
                      disabled={isSubmitting}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-sm text-destructive">{phoneError}</p>
                  )}
                </div>
              </div>
              
              <Button
                variant="wizard"
                size="lg"
                onClick={handleContactSubmit}
                className="w-full"
                disabled={isSubmitting}
              >
                <Check className="mr-2 h-5 w-5" />
                {t.contact.continueButton}
              </Button>
            </div>
          )}

          {/* Step 4: Date Selection */}
          {currentStep === "date" && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-4">
                <CalendarIcon className="h-6 w-6 text-accent" />
                <p className="font-semibold text-lg">{t.date.title}</p>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    if (isSubmitting) return true;
                    return date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                  initialFocus
                  className="rounded-md border shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Step 5: Time Selection */}
          {currentStep === "time" && selectedDate && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-lg">{t.time.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, language === "es" ? "EEEE, d 'de' MMMM 'de' yyyy" : "EEEE, MMMM d, yyyy", { locale })}
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-foreground" />
                      {language === "es" ? "Agendando..." : "Scheduling..."}
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      {t.time.confirm}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
