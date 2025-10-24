import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, MapPin, User, Clock, Globe, Sun, Moon, Phone, UserCheck, ChevronLeft, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Step, Language } from "@/types/appointment";
import { translations } from "@/i18n/translations";
import { EXAMPLE_ADDRESS, generateRandomTimeSlots, COMPANY_NAME, COMPANY_PHONE, generateWhatsAppLink } from "@/utils/appointment";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
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
    }
  };

  const getStepNumber = () => {
    const steps = ["address", "newClient", "contact", "date", "time"];
    return steps.indexOf(currentStep) + 1;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-soft)] p-4">
      <Card className="w-full max-w-2xl shadow-[var(--shadow-card)] border-border/50">
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
                >
                  <Globe className="h-3 w-3 mr-1" />
                  {language === "es" ? "EN" : "ES"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
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
                >
                  <Check className="mr-2 h-5 w-5" />
                  {t.address.canGo}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleAddressResponse(false)}
                  className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
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
                >
                  {t.client.newClient}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleClientTypeResponse(false)}
                  className="flex-1"
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
                  disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                  {t.time.confirm}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
