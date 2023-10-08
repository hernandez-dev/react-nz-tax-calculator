import { useEffect } from "react"
import { useImmerReducer } from "use-immer"

// formatAmount
function formatAmount(amount, decimals) {
  return new Intl.NumberFormat('en-US').format(parseFloat(amount).toFixed(decimals ? decimals : 2))
}

// calculateRateAmount
function calculateRateAmount(rate, income, selected) {
  if (!selected) return 0
  let total = 0
  const ratePercent = rate.rate / 100
  if (income >= rate.topIncome) {
    total = (rate.topIncome - rate.threshold) * ratePercent
  } else {
    total = (income - rate.threshold) * ratePercent
  }
  return total
}

export default function TaxCalculator() {
  // initialState
  const initialState = {
    income: "",
    taxRates: [
      {
        id: 1,
        rate: 14.5,
        threshold: 0,
        topIncome: 14500,
        amount: 0,
        description: "up to 14500"
      },
      {
        id: 2,
        rate: 17.5,
        threshold: 14500,
        topIncome: 48000,
        amount: 0,
        description: "over 14500 and up to 48000"
      },
      {
        id: 3,
        rate: 30,
        threshold: 48000,
        topIncome: 70000,
        amount: 0,
        description: "over 48000 and up to 70000"
      },
      {
        id: 4,
        rate: 33,
        threshold: 70000,
        topIncome: 180000,
        amount: 0,
        description: "over 70000 and up to 180000"
      },
      {
        id: 5,
        rate: 39,
        threshold: 180000,
        topIncome: 1000000000,
        amount: 0,
        description: "remaning income over 180000"
      },
    ],
    total: 0
  }

  // reducer
  function reducer(draft, action) {
    // console.log(action)
    switch(action.type) {
      case "set-income":
        const expression = /^([1-9][0-9]?).?([0-9]{1,3}?)$/g
        draft.income = action.value.trim() ? action.value.trim().replace(/[^0-9.?]/g, '') : ''
        break
      case "selected-tax-rates":
        draft.taxRates = action.value
        break
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState)

  // income changes
  useEffect(() => {
    const income = state.income ? parseFloat(state.income) : 0
    const ratesResults = state.taxRates
    .map(rate => {
      const selected = income > rate.threshold
      return({
        ...rate,
        selected: selected,
        amount: calculateRateAmount(rate, state.income, selected)
      }) // map return end
    }) // map end
    dispatch({ type: "selected-tax-rates", value: ratesResults })
  }, [state.income])

  return(
    <div className="absolute top-0 left-0 z-10 w-full h-full flex px-2">
      <div className="relative w-full max-w-lg m-auto px-2 bg-white rounded-lg shadow-xl shadow-black/30">
        <h1 className="font-bold text-sm text-center text-gray-500 uppercase leading-[3rem] tracking-wide">
          tax calculator
        </h1>
        <div className="">
          <div className="relative">
            <span className="absolute left-0 top-[2px] z-2 flex items-center justify-center w-[3rem] h-[3rem] text-sm text-center text-gray-500">
              <i className="fa-solid fa-dollar-sign" />
            </span>
            <input
              type="text"
              name="income"
              className={`outline-none block w-full px-[3rem] bg-gray-200 border-t-2 border-gray-200 rounded-md leading-[3rem] transition duration-100 focus:border-sky-500`}
              onChange={e => dispatch({ type: "set-income", value: e.target.value })}
              value={state.income}
              placeholder="eg: 14500"
            />
          </div>
        </div>
        <ul className="grid gap-2 mt-2">
          {state.taxRates.map(rate => (
            <li
              key={rate.id}
              className={`flex items-center h-[3rem] px-4 ${rate.selected ? 'bg-sky-100/50' : 'bg-gray-100'} rounded-md font-semibold text-sm ${rate.selected ? 'text-sky-500' : 'text-gray-600'} capitalize tracking-wide transition duration-300`}
            >
              <span className="block flex-1 leading-none">
                {rate.description}
              </span>
              <span className="block leading-none">
                ${formatAmount(calculateRateAmount(rate, state.income, rate.selected), 2)}
              </span>
            </li>
          ))}
        </ul>
        <p className="flex items-center justify-between h-[3rem] px-4 font-bold text-sm text-gray-600 capitalize">
          <span className="inline-block uppercase leading-none trackin-widest">
            total
          </span>
          <span className="inline-block leading-none">
            ${formatAmount(state.taxRates.reduce((total, rate) => total += rate.amount, 0), 2)}
          </span>
        </p>
      </div>
    </div>
  )
}
