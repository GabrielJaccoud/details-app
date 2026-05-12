import { motion } from "framer-motion";

export function CardSkeleton() {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gold-200 p-6 space-y-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="h-6 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-3/4" />
      <div className="h-12 bg-gradient-to-r from-gold-100 to-gold-50 rounded" />
      <div className="h-4 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-1/2" />
    </motion.div>
  );
}

export function ChartSkeleton() {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gold-200 p-6 space-y-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="h-6 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-1/3" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-full" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function TableSkeleton() {
  return (
    <motion.div
      className="space-y-3"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gold-200 p-4 flex gap-4">
          <div className="h-12 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-3/4" />
            <div className="h-3 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-1/2" />
          </div>
          <div className="h-8 bg-gradient-to-r from-gold-100 to-gold-50 rounded w-20 flex-shrink-0" />
        </div>
      ))}
    </motion.div>
  );
}

export function DashboardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeletonFull() {
  return (
    <div className="space-y-8">
      <DashboardSkeletonGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}
