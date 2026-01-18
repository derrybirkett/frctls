export function Dashboard() {
  const widgets = [
    { title: 'Total Users', value: '---', icon: '👥' },
    { title: 'Active Sessions', value: '---', icon: '🔄' },
    { title: 'Revenue', value: '$---', icon: '💰' },
    { title: 'Tasks Completed', value: '---', icon: '✓' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your app.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgets.map((widget) => (
          <div
            key={widget.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{widget.icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {widget.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {widget.title}
            </p>
          </div>
        ))}
      </div>

      {/* Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 italic">
            No recent activity to display.
          </p>
        </div>
      </div>
    </div>
  );
}
