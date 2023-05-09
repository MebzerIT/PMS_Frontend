import withAuth from "../../hoc/withAuth";
import "./Gjøremålsliste.css"; 


const Gjøremålsliste = () => (
    <>
        <div className="list-container">
            <h2 className="list-title">Dine gjøremålsliste</h2>

            <div className="form-container">
                <label className="form-label">Gjøremål</label><br></br>
                <input className="form-input"></input>

                <form className="form" action="https://example.com">
                    <label className="form-label">
                        Tidsfrist: <br></br>
                        <input className="form-input" type="date" name="bday" />
                    </label>
                </form>

                <label className="form-label" for="Kategori">Kategori:</label> <br></br>
                <select className="form-select" id="Kategori" name="Kategori">
                    <option value="Jobb">Jobb</option>
                    <option value="Privat">Personlig</option>
                    <option value="Annet">Annet</option>
                </select> <br></br>
                
                <button>add</button>
            </div>
        </div>
    </>
)

export default withAuth(Gjøremålsliste);

