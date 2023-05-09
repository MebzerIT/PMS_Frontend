import withAuth from "../../hoc/withAuth";
import "./Lagprosjekt.css";

const Lagprosjekt = () => (
  <>
    <div className="prosjekt">
      <h2>Lag nytt prosjekt:</h2>

      <label>Tittel</label>
      <br />
      <input type="text" name="tittel" required />
      <br />

      <label htmlFor="Type">Type:</label>
      <br />
      <select id="Type" name="Type">
        <option value="Jobb">Jobb</option>
        <option value="Privat">Personlig</option>
      </select>
      <br />

      <label>Beskrivelse</label>
      <br />
      <input type="text" name="beskrivelse" required />
      <br />

      <form action="https://example.com">
        <label>
          Startdato: <br />
          <input type="date" name="startdato" />
        </label>
      </form>
      <br />

      <form action="https://example.com">
        <label>
          Sluttdato: <br />
          <input type="date" name="sluttdato" />
        </label>
      </form>

      <form action="/action_page.php">
        <label htmlFor="img">Velg Bilde:</label>
        <input type="file" id="img" name="img" accept="image/*" />
     </form>
    </div>
    </>
)
export default withAuth(Lagprosjekt);
