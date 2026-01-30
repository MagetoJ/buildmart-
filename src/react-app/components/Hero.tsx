import { ArrowRight, Truck, Shield, Award } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
              Premium Building Materials
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Quality Materials for Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Construction Projects</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From cement to bricks, sand to ballast - we supply everything you need to build strong and last long.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-lg transition-all border-2 border-gray-200">
                View Catalog
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fast Delivery</div>
                  <div className="text-sm text-gray-600">Same day available</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Guaranteed</div>
                  <div className="text-sm text-gray-600">Quality assured</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Trusted</div>
                  <div className="text-sm text-gray-600">10+ years</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-red-200 rounded-3xl blur-3xl opacity-30"></div>
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80"
              alt="Construction materials"
              className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
