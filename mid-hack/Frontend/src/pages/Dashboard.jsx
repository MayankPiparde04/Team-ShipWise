import React from 'react'
import BufferingCalculation from '../calculation/BufferingCalculation'
import OptimalCalculation from '../calculation/OptimalCalculation'

function Dashboard() {
  return (
    <div>
      <BufferingCalculation />
      <OptimalCalculation />
    </div>
  )
}

export default Dashboard