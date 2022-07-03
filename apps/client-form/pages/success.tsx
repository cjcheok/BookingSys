
import Head from "../node_modules/next/head";
import "react-datepicker/dist/react-datepicker.css";  




export default function Home() {


  return (
    <>
      <Head>
        <title>Booking Page</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous" />

      </Head>
      <div className="container">
  <main>
    <div className="py-5 text-center">
      <h2>Booking form</h2>
      <p className="lead">Your booking is successful!</p>
    </div>
    
  </main>
      </div>
    </>
  )
}
