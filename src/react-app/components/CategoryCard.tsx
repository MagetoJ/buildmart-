import * as Icons from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: string;
}

export default function CategoryCard({ name, icon }: CategoryCardProps) {
  const Icon = (Icons as any)[icon] || Icons.Package;

  return (
    <button className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-orange-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
        {name}
      </h3>
    </button>
  );
}
