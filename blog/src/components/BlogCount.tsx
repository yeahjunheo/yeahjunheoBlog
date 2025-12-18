interface BlogCountProps {
  count: number;
  maxCapacity?: number;
}

export default function BlogCount({ count, maxCapacity = 256 }: BlogCountProps) {
  const percentage = (count / maxCapacity) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-surface border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Garden Progress
        </h2>
        <span className="text-3xl font-bold text-orange">
          {count} / {maxCapacity}
        </span>
      </div>

      <div className="w-full bg-border rounded-full h-3 mb-3 overflow-hidden">
        <div
          className="bg-linear-to-r from-green-500 via-green-400 to-orange h-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-text-secondary text-center">
        {count === 0 && "Your garden awaits its first seed"}
        {count > 0 && count < 50 && "Your garden is just beginning to sprout"}
        {count >= 50 && count < 100 && "Your garden is growing beautifully"}
        {count >= 100 && count < 200 && "Your garden is flourishing"}
        {count >= 200 && count < maxCapacity && "Your garden is nearly full"}
        {count >= maxCapacity && "Your garden is in full bloom"}
      </p>
    </div>
  );
}
