import { motion } from "framer-motion";
import { Users, BookOpen, CalendarCheck, Wallet, TrendingUp, GraduationCap } from "lucide-react";

const stats = [
  { label: "Total Students", value: "310", icon: Users, change: "+12%" },
  { label: "Total Subjects", value: "6", icon: BookOpen, change: "+2" },
  { label: "Attendance Rate", value: "94%", icon: CalendarCheck, change: "+3%" },
  { label: "Fee Collection", value: "₹3.75L", icon: Wallet, change: "+18%" },
];

const Dashboard = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, John Doe</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {stat.change} from last month
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">Quick Overview</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Top Class</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">5th Class</p>
            <p className="text-xs text-muted-foreground">72 students</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Best Subject</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">Science</p>
            <p className="text-xs text-muted-foreground">Avg. 87%</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">23 New</p>
            <p className="text-xs text-muted-foreground">Admissions</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
