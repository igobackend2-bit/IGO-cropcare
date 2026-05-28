
import Footer from '@/components/layout/Footer'
import OTPAuth from '@/components/auth/OTPAuth'

export default function LoginPage() {
  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to CropCare</h1>
              <p className="text-lg text-gray-600 mb-8">
                Login to access exclusive offers, track your orders, and get personalized farming
                recommendations.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Easy OTP Login</h3>
                    <p className="text-gray-600">Quick and secure login using just your phone number</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Track Orders</h3>
                    <p className="text-gray-600">Monitor your orders in real-time from farm to doorstep</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Expert Recommendations</h3>
                    <p className="text-gray-600">Get personalized farming tips and product suggestions</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Exclusive Deals</h3>
                    <p className="text-gray-600">Access member-only discounts and seasonal offers</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-green-50 p-8 rounded-lg border-2 border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Farmers Love Us</h3>
                <div className="space-y-3 text-gray-700">
                  <p>✓ 30M+ farmers trust us</p>
                  <p>✓ 9000+ quality products</p>
                  <p>✓ 400+ trusted brands</p>
                  <p>✓ 95%+ customer satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center">
              <OTPAuth />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
