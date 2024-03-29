import styles from './explainer.module.scss'

export default function Explainer() {
    return (
        <>
            <h1 className={styles.heading + ' h2'}>PDMedCalc</h1>
            <h2 className={styles.subheading + ' h3'}>Who is this tool for?</h2>
            <p className={styles.sentence}>Doctors, nurses and pharmacists who are looking after patients with Parkinson’s Disease (PD) who have been admitted to hospital and are unable to take their medications orally.</p>
            <h2 className={styles.subheading + ' h3'}>What is the purpose of the tool?</h2>
            <ul className={styles.bullets}>
                <li className={styles.sentence + " p"}>Suddenly stopping PD medications can be extremely dangerous and due to the risk of neuroleptic malignant syndrome, potentially even fatal.</li>
                <li className={styles.sentence + " p"}>In patients unable to take their usual PD medications orally, this tool is designed to convert a patient’s usual PD medications to a ‘Levodopa equivalent dose’ (LED).</li>
                <li className={styles.sentence + " p"}>The LED is then used to calculate the dose of dispersible madopar to be given via a nasogastric tube to provide a patient with their usual amount of PD medication.</li>
                <li className={styles.sentence + " p"}>The tool also provides a conversion to a rotigotine patch dose, as an alternative to nasogastric dispersible madopar. A correction factor is applied to avoid large rotigotine patch doses, as these may cause side effects such as confusion, hallucinations or delirium.</li>
                <li className={styles.sentence + " p"}>Amantadine can be safely omitted if swallow is compromised.</li>
                <li className={styles.sentence + " p"}>If the patient is on a subcutaneous Apomorphine infusion, Duodopa (via PEJ) or a subcutaneous ProDuodopa infusion (foslevodopa/foscarbidopa) no conversion is required - please continue to use their existing non-oral treatment.</li>
            </ul >
            <h2 className={styles.subheading + ' h3'}>Where did this tool come from?</h2>
            <ul className={styles.bullets}>
                <li className={styles.sentence}><p>The development of the tool was led by James Fisher and the Northumbria Healthcare NHS Foundation Trust Parkinson’s Disease team in 2014, who worked in collaboration with Daniel Jamieson (Computing Science PhD student at Newcastle University).</p></li>
                <li className={styles.sentence}><p>The tool was redeveloped in 2024 with support from TPXimpact and funding from Parkinson’s UK. PDMedCalc was registered with the UK Medicines & Healthcare products Regulatory Agency (MHRA) as a Class I medical device on 15/02/24. If you have any questions or problems related to PDMedCalc, please contact us using the email link at the foot of this page.</p></li>
            </ul>

        </>
    )
}