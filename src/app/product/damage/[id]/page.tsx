

  export default function InsertProduct({ params }: { params: { id: number } }) {
    const { id } = params
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
        { id }
      </div>
    );
  }