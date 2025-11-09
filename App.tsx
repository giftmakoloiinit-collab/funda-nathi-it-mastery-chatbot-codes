import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Role, ChatFlowState } from './types';
import { sendMessageToGemini, resetChat, extractInfoWithGemini } from './services/geminiService';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import MessageInput from './components/MessageInput';
import Logo from './components/Logo';

const CERTIFICATIONS_LIST = `
### CompTIA
- CompTIA A+
- CompTIA Network+
- CompTIA Security+
- CompTIA Cloud+
- CompTIA Linux+
- CompTIA PenTest+
- CompTIA CySA+

### Cisco
- Cisco Certified Network Associate (CCNA)
- Cisco Certified Network Professional (CCNP)
- Cisco Certified Internetwork Expert (CCIE)
- Cisco Certified DevNet Associate
- Cisco Certified DevNet Professional
- Cisco Certified CyberOps Associate

### AWS
- AWS Certified Solutions Architect – Associate
- AWS Certified Solutions Architect – Professional
- AWS Certified Developer – Associate
- AWS Certified SysOps Administrator – Associate
- AWS Certified DevOps Engineer – Professional
- AWS Certified Security – Specialty
- AWS Certified Advanced Networking – Specialty
- AWS Certified Machine Learning – Specialty

### Microsoft
- Microsoft Certified: Azure Fundamentals (AZ-900)
- Microsoft Certified: Azure Administrator Associate
- Microsoft Certified: Azure Solutions Architect Expert
- Microsoft Certified: Azure Security Engineer Associate
- Microsoft Certified: Azure AI Engineer Associate
- Microsoft Certified: Azure Data Engineer Associate
- Microsoft Certified: Azure DevOps Engineer Expert
- Microsoft Certified: Microsoft 365 Fundamentals
- Microsoft Certified: Microsoft 365 Security Administrator

### Google
- Google IT Support Professional Certificate
- Google Cloud Digital Leader
- Google Associate Cloud Engineer
- Google Professional Cloud Architect
- Google Professional Data Engineer
- Google Professional Cloud Network Engineer
- Google Professional Cloud Security Engineer

### Security & Auditing
- Certified Ethical Hacker (CEH)
- Certified Information Systems Security Professional (CISSP)
- Certified Information Security Manager (CISM)
- Certified Information Systems Auditor (CISA)
- Certified Cloud Security Professional (CCSP)
- Offensive Security Certified Professional (OSCP)
- Offensive Security Certified Expert (OSCE)
- EC-Council Certified Security Analyst (ECSA)

### GIAC
- GIAC Security Essentials (GSEC)
- GIAC Penetration Tester (GPEN)
- GIAC Certified Incident Handler (GCIH)
- GIAC Certified Intrusion Analyst (GCIA)
- GIAC Certified Forensic Analyst (GCFA)

### IT Service & Project Management
- ITIL Foundation Certification
- ITIL 4 Managing Professional
- ITIL 4 Strategic Leader
- Project Management Professional (PMP)
- Certified ScrumMaster (CSM)
- Certified Scrum Product Owner (CSPO)
- Lean Six Sigma Green Belt
- Lean Six Sigma Black Belt

### Linux
- Linux Essentials (LPI)
- LPIC-1 Linux Administrator
- LPIC-2 Linux Engineer
- LPIC-3 Linux Enterprise Professional
- Red Hat Certified System Administrator (RHCSA)
- Red Hat Certified Engineer (RHCE)
- Red Hat Certified Architect (RHCA)

### Oracle
- Oracle Certified Java Programmer
- Oracle Certified Professional, Java SE
- Oracle Certified Expert, Java EE

### VMware
- VMware Certified Professional – Data Center Virtualization (VCP-DCV)
- VMware Certified Advanced Professional (VCAP)
- VMware Certified Design Expert (VCDX)

### Salesforce
- Salesforce Certified Administrator
- Salesforce Certified Advanced Administrator
- Salesforce Certified Platform App Builder
- Salesforce Certified Platform Developer I
- Salesforce Certified Platform Developer II

### Cloud Native & DevOps
- Certified Kubernetes Administrator (CKA)
- Certified Kubernetes Application Developer (CKAD)
- Certified Kubernetes Security Specialist (CKS)
- HashiCorp Certified: Terraform Associate

### Vendor-Specific Security
- Palo Alto Networks Certified Network Security Engineer (PCNSE)
- Fortinet NSE 1, 2, 3, 4, 5, 6, 7, 8
- Splunk Core Certified User
- Splunk Core Certified Power User
- Splunk Enterprise Certified Admin
- Splunk Certified Architect
- Check Point Certified Security Administrator (CCSA)
- Check Point Certified Security Expert (CCSE)

### Wireless
- Certified Wireless Network Administrator (CWNA)
- Certified Wireless Security Professional (CWSP)

### Data & BI
- Tableau Desktop Specialist
- Tableau Desktop Certified Associate
- Tableau Server Certified Associate
`;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatFlowState, setChatFlowState] = useState<ChatFlowState>(ChatFlowState.AWAITING_NAME_INPUT);
  const [userName, setUserName] = useState<string>('');
  const [userCertification, setUserCertification] = useState<string>('');
  const [userLanguage, setUserLanguage] = useState<string | null>('english');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addMessage = useCallback((content: string, role: Role) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  }, []);
  
  // Initial greeting message
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage(
        "Aweh, Hola, Howzit! 👋 I’m the Funda Nathi IT Mastery Chatbot — your friendly guide to mastering IT, coding, and tech skills step by step. What’s your name, superstar?",
        Role.MODEL
      );
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [addMessage]);


  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const saveChatToFile = () => {
    const chatContent = messages
      .filter(msg => msg.role !== Role.SYSTEM)
      .map(msg => `${msg.role === Role.USER ? userName || 'User' : 'Funda Nathi'}: ${msg.content}`)
      .join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `funda-nathi-lesson-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addMessage("✅ Your lesson has been saved as a text file.", Role.SYSTEM);
  };
  
  const startNewSessionFlow = useCallback(() => {
    setIsLoading(true);
    const initialMessage = `It’s great to meet you, ${userName}! 💛 Which IT certification are you preparing for today?\n\n${CERTIFICATIONS_LIST}`;
    
    setMessages([]);
    resetChat();
    setChatFlowState(ChatFlowState.AWAITING_CERTIFICATION_INPUT);
    setUserCertification('');
    setUserLanguage('english');

    setTimeout(() => {
        addMessage(initialMessage, Role.MODEL);
        setIsLoading(false);
    }, 500);
  }, [addMessage, userName]);


  const processCommand = (command: string) => {
    const lowerCaseCommand = command.toLowerCase();
    if (lowerCaseCommand === '/new') {
        startNewSessionFlow();
    } else if (lowerCaseCommand === '/save') {
        saveChatToFile();
    } else if (lowerCaseCommand === '/toggle-translation') {
        const newTranslationState = !isTranslationEnabled;
        setIsTranslationEnabled(newTranslationState);
        addMessage(`Translations have been ${newTranslationState ? 'enabled' : 'disabled'}.`, Role.SYSTEM);
        resetChat();
    } else {
        addMessage(`I don't recognize the command "${command}". You can use /new, /save, or /toggle-translation.`, Role.SYSTEM);
    }
  };

  const handleSendMessage = async (input: string) => {
    if (isLoading) return;
    
    if (input.startsWith('/')) {
        processCommand(input);
        return;
    }

    addMessage(input, Role.USER);
    setIsLoading(true);

    switch (chatFlowState) {
      case ChatFlowState.AWAITING_NAME_INPUT:
        try {
            const extractedName = await extractInfoWithGemini(input, "the user's name");
            setUserName(extractedName);
            addMessage(`It’s great to meet you, ${extractedName}! 💛 Which IT certification are you preparing for today?\n\n${CERTIFICATIONS_LIST}`, Role.MODEL);
            setChatFlowState(ChatFlowState.AWAITING_CERTIFICATION_INPUT);
        } catch(e) {
            addMessage("Sorry, I had trouble getting your name. Could you please tell me again?", Role.MODEL);
        } finally {
            setIsLoading(false);
        }
        break;

      case ChatFlowState.AWAITING_CERTIFICATION_INPUT:
        try {
            const extractedCert = await extractInfoWithGemini(input, "the IT certification name");
            setUserCertification(extractedCert);
            addMessage(`Excellent choice! We will focus on **${extractedCert}**. To make your learning easier, I can provide translations for key concepts in any of South Africa's official languages. Which language would you prefer?\n\n*   Afrikaans\n*   English (for English only)\n*   isiNdebele\n*   isiXhosa\n*   isiZulu\n*   Sepedi\n*   Sesotho\n*   Setswana\n*   siSwati\n*   Tshivenda\n*   Xitsonga`, Role.MODEL);
            setChatFlowState(ChatFlowState.AWAITING_LANGUAGE_INPUT);
        } catch (e) {
            addMessage("Sorry, I had trouble identifying that certification. Could you please specify which one you're studying for?", Role.MODEL);
        } finally {
            setIsLoading(false);
        }
        break;

      case ChatFlowState.AWAITING_LANGUAGE_INPUT:
        try {
            const languageList = "Afrikaans, English, isiNdebele, isiXhosa, isiZulu, Sepedi, Sesotho, Setswana, siSwati, Tshivenda, Xitsonga";
            const extractedLang = await extractInfoWithGemini(input, `the name of the language from this list: ${languageList}. If the user mentions 'English only' or something similar, just return 'English'.`);
            
            const normalizedLang = extractedLang.trim().toLowerCase();
            const supportedLanguages = ['afrikaans', 'english', 'isindebele', 'isixhosa', 'isizulu', 'sepedi', 'sesotho', 'setswana', 'siswati', 'tshivenda', 'xitsonga'];
            
            if (supportedLanguages.includes(normalizedLang)) {
                setUserLanguage(normalizedLang);
                resetChat();
                
                const setupMessage = normalizedLang === 'english'
                    ? `Great, we'll stick to English. Let's dive into **${userCertification}**. I'm preparing your first lesson now...`
                    : `Ngiyabonga! I'll provide support in **${normalizedLang}**. Let's start with your **${userCertification}** prep. Preparing your first lesson now...`;
                addMessage(setupMessage, Role.SYSTEM);
                setChatFlowState(ChatFlowState.CHATTING);

                const firstLessonPrompt = `The user's name is ${userName}. Proactively start the very first lesson for the **${userCertification}** certification. Greet them warmly by name, then immediately teach the most fundamental, introductory concept for this certification. The explanation must be simple and easy for a beginner to understand. Crucially, you MUST end this first lesson by following the mandatory 3-step conclusion format: 1. Give positive feedback using their name (${userName}). 2. Provide a numbered list of three logical next topics to continue from this introduction. 3. Ask them which topic they want to learn next, using their name (${userName}).`;
                
                const botResponse = await sendMessageToGemini(firstLessonPrompt, messages, normalizedLang, isTranslationEnabled);
                addMessage(botResponse, Role.MODEL);

            } else {
                addMessage(`I don't recognize that language. Please choose from the list or say "English only". 💛`, Role.MODEL);
            }
        } catch(e) {
            addMessage("Sorry, I had trouble with that. Please choose a language from the list.", Role.MODEL);
        } finally {
            setIsLoading(false);
        }
        break;

      case ChatFlowState.CHATTING:
        try {
          const history = [...messages, { role: Role.USER, content: input, timestamp: Date.now() }];
          const botResponse = await sendMessageToGemini(input, history, userLanguage, isTranslationEnabled);
          addMessage(botResponse, Role.MODEL);
        } catch (error) {
          addMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment. 💛", Role.MODEL);
        } finally {
          setIsLoading(false);
        }
        break;
    }
  };
  
  return (
    <div className="bg-[#FFEB70] h-screen flex flex-col text-[#333333]">
      <style>{`
        :root {
          --energetic-light-yellow: #FFEB70;
          --white: #FFFFFF;
          --charcoal-gray: #333333;
          --highlight-gray: #EEEEEE;
          --deep-energetic-yellow: #FFD500;
        }
        .prose hr {
          border-color: var(--charcoal-gray); opacity: 0.5; border-top-width: 4px; border-radius: 2px; margin-top: 1.5rem; margin-bottom: 1.5rem;
        }
        .prose h3 {
          color: #B91C1C; font-weight: 700; letter-spacing: 0.05em;
        }
      `}</style>

      <Header />

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto pt-24 pb-24 space-y-6 flex flex-col">
          {messages.map((msg, index) => (
             msg.role === Role.SYSTEM
                ? <div key={index} className="text-center text-sm text-gray-500 px-4">{msg.content}</div>
                : <ChatBubble key={index} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-end space-x-3 max-w-xl w-full mx-4 justify-start">
                <Logo className="w-8 h-8 flex-shrink-0 mb-2" />
                <div className="p-4 rounded-2xl shadow-md bg-[#FFF9C4] text-charcoal-gray self-start" style={{ borderTopLeftRadius: '0.25rem' }}>
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
          )}
      </main>

      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      
    </div>
  );
};

export default App;