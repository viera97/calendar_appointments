import { TranslationConfig } from "@/types/appointment";

export const translations: TranslationConfig = {
  es: {
    title: "Agendar Cita",
    stepDescriptions: {
      address: "Primero, confirmemos tu ubicación",
      newClient: "¿Es tu primera vez con nosotros?",
      contact: "Necesitamos tus datos de contacto",
      date: "Consulta personalizada - Selecciona una fecha",
      time: "Elige tu horario preferido"
    },
    contact: {
      title: "Información de Contacto",
      nameLabel: "Nombre completo",
      namePlaceholder: "Ingresa tu nombre completo",
      phoneLabel: "Número de teléfono",
      phonePlaceholder: "Ej: +1234567890 o 123-456-7890",
      continueButton: "Continuar",
      nameRequired: "El nombre es requerido",
      phoneRequired: "El teléfono es requerido",
      phoneInvalid: "Por favor ingresa un número de teléfono válido"
    },
    address: {
      question: "¿Puedes dirigirte a:",
      canGo: "Sí, puedo ir",
      cantGo: "No puedo"
    },
    client: {
      question: "¿Eres cliente nuevo?",
      newClient: "Sí, soy nuevo",
      existingClient: "Ya soy cliente"
    },
    date: {
      title: "Selecciona la fecha de tu cita"
    },
    time: {
      title: "Horarios disponibles",
      confirm: "Agendar Cita"
    },
    toast: {
      title: "¡Cita agendada!",
      description: "Tu cita ha sido confirmada para el {date} a las {time}."
    }
  },
  en: {
    title: "Schedule Appointment",
    stepDescriptions: {
      address: "First, let's confirm your location",
      newClient: "Is this your first time with us?",
      contact: "We need your contact information",
      date: "Personalized consultation - Select a date",
      time: "Choose your preferred time"
    },
    contact: {
      title: "Contact Information",
      nameLabel: "Full name",
      namePlaceholder: "Enter your full name",
      phoneLabel: "Phone number",
      phonePlaceholder: "Ex: +1234567890 or 123-456-7890",
      continueButton: "Continue",
      nameRequired: "Name is required",
      phoneRequired: "Phone is required",
      phoneInvalid: "Please enter a valid phone number"
    },
    address: {
      question: "Can you go to:",
      canGo: "Yes, I can go",
      cantGo: "I can't"
    },
    client: {
      question: "Are you a new client?",
      newClient: "Yes, I'm new",
      existingClient: "I'm already a client"
    },
    date: {
      title: "Select your appointment date"
    },
    time: {
      title: "Available times",
      confirm: "Schedule Appointment"
    },
    toast: {
      title: "Appointment scheduled!",
      description: "Your appointment has been confirmed for {date} at {time}."
    }
  }
};