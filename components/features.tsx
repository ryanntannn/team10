export function Features() {
  return (
    <div className="grid grid-cols-7 gap-4 w-full">
      <div className="border p-10 rounded-lg col-span-3">
        <h2 className="text-2xl font-medium">Feature 1</h2>
        <p>Feature 1 description</p>
      </div>
      <div className="border p-10 rounded-lg col-span-4">
        <h2 className="text-2xl font-medium">Feature 2</h2>
        <p>Feature 2 description</p>
      </div>
      <div className="border p-10 rounded-lg col-span-4">
        <h2 className="text-2xl font-medium">Feature 3</h2>
        <p>Feature 3 description</p>
      </div>
      <div className="border p-10 rounded-lg col-span-3">
        <h2 className="text-2xl font-medium">Feature 4</h2>
        <p>Feature 4 description</p>
      </div>
    </div>
  );
}
