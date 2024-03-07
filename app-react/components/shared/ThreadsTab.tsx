/*Permet de poouvoir fetch les postes appartenant à cet exact utilisateur */
interface Props{
    currentUserId : string ;
    accountId : string ;
    accountType : string ;
}

const ThreadsTab=async ({currentUserId,accountId,accountType} :
     Props ) => {
        //TODO: Fetch profile threads
    return (
    <section>
        ThreadsTab
    </section>
)
}
export default ThreadsTab;