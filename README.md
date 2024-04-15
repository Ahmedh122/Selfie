# SELFIE
progetto tech web 2024


nero,verde = obbligatorio
arancione = moduli aggiuntivi
blu  = esempi

riassuntino :

tipi di evento :
- individuali o di gruppo
- unici , ripetuti
- semplici, complessi e strutturati

Selfie è un'applicazione client + server usabile in maniera equivalente sia da cellulare che da PC

app base : 
-prevede di aggiungere, rimuovere,
postare e modificare eventi semplici del solo utente, posizionati in
un calendario e di durata nota (intervallo di ore, intere giornate,
periodi più lunghi. Gli eventi si possono sovrapporre liberamente.
Esistono visualizzazioni comode giornaliere, settimanali e mensili
degli eventi inseriti

-E' realizzato un timer (la view Pomodoro) per organizzare il passo
dello studio.

-E' fornito un editor di appunti

-E' realizzato un sistema per navigare nel tempo e arrivare ad una
data passata o futura come desiderato


prima estensione :
sistemi di notifica e geolocalizzazione

seconda estensione :
eventi di gruppo

terza estensione :
sistemi di gestione di progetti complessi

##########

accesso :

Il record di un account contiene sicuramente nome utente, password e nome vero
ed una quantità a piacere di informazioni personali

homepage :

serve per navigare tra le view: Calendario, Pomodoro, Note, (Progetti).
vengono mostrate preview dei contenuti delle singole view: ad esempio
gli eventi della settimana/giorno corrente, l’ultima nota creata, le attività imminente,
report sull’ultimo pomodoro svolto, scadenze imminenti dei progetti


requisiti progetto :

calendario , note , pomodoro sono mobile first, sono realizzate con il
framework Javascript/Typescript e CSS preferito, e sono pensate per essere
usate velocemente e facilmente da tutti. Su PC è comunque possibile
compiere in maniera adeguata le funzionalità previste.

La Time Machine è sempre visualizzata su PC e immediatamente accessibile
(senza navigazione) su mobile.

La parte gestione progetto è PC-first, e sfrutta completamente e
appropriatamente uno schermo grande. Deve essere fatta in Javascript puro
(vanno bene Web Components) e con il framework CSS preferito.Device
mobili debbono comunque permettere di compiere in maniera adeguata le
funzionalità previste.


vincoli hard :

il back-office è realizzato con Node, MongoDB e vanilla Javascript
Express e moduli ok. Moduli installabili con npm, ok

L'applicazione home + calendario + pomodoro + note è realizzata con un
framework a scelta tra Angular, React, Vue, Svelte, etc.

L'applicazione gestione progetto è realizzata senza framework (vanno bene
Web Components) e vanilla Javascript.

l framework per la grafica è libero ma mi aspetto sofisticazione grafica,
facilità d'uso e eleganza. Vanno bene Bootstrap, Tailwind, Foundation,
ma anche altri a vostra scelta purché compatibili con gli altri vincoli.

l deploy deve avvenire su due container docker sulle macchine del
dipartimento.

Tutti i database vengono presentati già popolati.
ecc.... vedi slide
