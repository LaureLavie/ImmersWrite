
export default function ConfirmationPage() {
  return (
    <main style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1>📬 Vérifie ta boîte mail !</h1>
      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        Un email de confirmation t'a été envoyé.<br />
        Clique sur le lien dans l'email pour activer ton compte.
      </p>
      <p style={{ marginTop: "1rem", color: "#888" }}>
        Une fois confirmé, tu pourras te <a href="/login">connecter ici</a>.
      </p>
    </main>
  );
}