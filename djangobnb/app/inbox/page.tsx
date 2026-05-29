import Conversation from "../components/inbox/Converstion";
const  InboxPage= () => {
    return (
        <main className="max-w-375 mx-auto px-6 pb-6 space-y-5 " >
            <h1 className="my-6 text-2xl">Inbox</h1>
         <Conversation />
         <Conversation />
         <Conversation />
         <Conversation />
        </main>
    );
};

export default InboxPage;