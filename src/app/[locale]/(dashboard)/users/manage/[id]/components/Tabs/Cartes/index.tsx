import CartesMain from './CartesMain'
import CartesSide from './CartesSide'

const cartes = [
    {
      id: 1,
      cardNumber: '1234 5678 9101 2345',
      type: "visa",
      matricule: 'skrcV55871327',
      date: '14 / 01 / 2024',
      solde: '215 000 Fcfa',
      status: 'Active',
      activateDate: 'il y a 02 mois'
    },{
      id: 2,
      cardNumber: '1234 5678 9101 2345',
      type: "visa",
      matricule: 'skrcV55871327',
      date: '14 / 01 / 2024',
      solde: '215 000 Fcfa',
      status: 'Active',
      activateDate: 'il y a 02 mois'
    },{
      id: 3,
      cardNumber: '1234 5678 9101 2345',
      type: "visa",
      matricule: 'skrcV55871327',
      date: '14 / 01 / 2024',
      solde: '215 000 Fcfa',
      status: 'Active',
      activateDate: 'il y a 02 mois'
    },{
      id: 4,
      cardNumber: '1234 5678 9101 2345',
      type: "visa",
      matricule: 'skrcV55871327',
      date: '14 / 01 / 2024',
      solde: '215 000 Fcfa',
      status: 'Active',
      activateDate: 'il y a 02 mois'
    },{
      id: 5,
      cardNumber: '1234 5678 9101 2345',
      type: "visa",
      matricule: 'skrcV55871327',
      date: '14 / 01 / 2024',
      solde: '215 000 Fcfa',
      status: 'Active',
      activateDate: 'il y a 02 mois'
    }
  ]

export default function index() {
  return (
    <section className="pl-4 flex flex-col md:flex-row justify-start items-start gap-10 overflow-hidden">
      <CartesMain cards={cartes}/>
      <CartesSide nbCards={cartes.length}/>
    </section>
  )
}
