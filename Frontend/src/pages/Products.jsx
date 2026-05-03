import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'

const Products = () => {

  // Redux products (source of truth)
  const products = useSelector(store => store.product.products)

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999])
  const [sortOrder, setSortOrder] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products once
  const getAllProducts = async () => {
    try {
      setLoading(true)

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/products/getallproducts`
      )

      if (res.data.success) {
        dispatch(setProducts(res.data.products))
      }

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Error fetching products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  // ✅ FILTER LOGIC (NO REDUX DISPATCH HERE)
  const filteredProducts = useMemo(() => {

    let filtered = [...products]

    if (search.trim()) {
      filtered = filtered.filter(p =>
        (p.productName || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category)
    }

    if (brand !== "All") {
      filtered = filtered.filter(p => p.brand === brand)
    }

    filtered = filtered.filter(
      p =>
        p.productPrice >= priceRange[0] &&
        p.productPrice <= priceRange[1]
    )

    if (sortOrder === "low to high") {
      filtered = [...filtered].sort((a, b) => a.productPrice - b.productPrice)
    }

    if (sortOrder === "high to low") {
      filtered = [...filtered].sort((a, b) => b.productPrice - a.productPrice)
    }

    return filtered
  }, [products, search, category, brand, priceRange, sortOrder])

  return (
    <div className='pt-20 pb-10'>

      {/* MOBILE TOP BAR */}
      <div className='md:hidden flex gap-2 px-4 py-2 mb-4 sticky top-16 bg-white z-30 shadow-sm'>

        <button
          onClick={() => setShowFilters(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-md"
        >
          Filters
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded-md"
        />
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <div className="bg-white w-72 p-4 overflow-y-auto">

            <button
              onClick={() => setShowFilters(false)}
              className="mb-4 text-red-500 font-semibold"
            >
              Close ✕
            </button>

            <FilterSidebar
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setShowFilters={setShowFilters}
            />
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-3 md:px-4'>

        {/* SIDEBAR */}
        <div className="hidden md:block">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            setShowFilters={setShowFilters}
          />
        </div>

        {/* MAIN */}
        <div className='flex flex-col flex-1 px-1'>

          {/* SORT */}
          <div className='flex justify-end mb-4'>
            <Select onValueChange={(value) => setSortOrder(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="low to high">Low → High</SelectItem>
                  <SelectItem value="high to low">High → Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* PRODUCTS GRID */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-2 mt-2'>

            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                loading={loading}
              />
            ))}

          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              No products found
            </p>
          )}

        </div>
      </div>
    </div>
  )
}

export default Products














