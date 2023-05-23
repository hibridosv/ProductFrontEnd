
  export default function GetProduct({ params }: { params: { id: number } }) {
    return <h1>Product Number {params.id}</h1>;
  }