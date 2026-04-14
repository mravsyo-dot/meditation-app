export default function TestPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Test</h1>
      <button onClick={() => {
        const audio = new Audio('/sounds/abc.m4a');
        audio.play();
      }}>
        Play
      </button>
    </div>
  );
}