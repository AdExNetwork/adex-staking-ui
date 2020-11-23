import React, { useEffect, useState, useContext, useCallback } from "react"
import { getFarmPoolsStats } from "./actions/farm"
import AppContext from "./AppContext"
import { useTranslation } from "react-i18next"

export const FarmContext = React.createContext()

const REFRESH_INTERVAL = 60_000 // 60 sec

function useFarm() {
	const { t } = useTranslation()
	const { chosenWalletType, prices, addSnack } = useContext(AppContext)
	const [pricesLoaded, setPricesLoaded] = useState(false)
	const [farmStats, setStats] = useState({})
	const [getStats, setGetFarmStats] = useState(false)

	const refreshFarmStats = useCallback(async () => {
		const doUpdate = getStats && pricesLoaded

		if (doUpdate) {
			try {
				const stats = await getFarmPoolsStats({
					chosenWalletType,
					externalPrices: prices
				})
				setStats(stats)
			} catch (e) {
				console.error("err loading farm stats", e)
				if (e.code === 4001) {
					addSnack(t("errors.authDeniedByUser"), "error", 20_000)
				} else {
					addSnack(
						t("errors.loadingStats", {
							error: !!e ? e.message || e.toString() : ""
						}),
						"error",
						20_000
					)
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getStats, chosenWalletType.name, pricesLoaded, t])

	useEffect(() => {
		refreshFarmStats()
		const intvl = setInterval(refreshFarmStats, REFRESH_INTERVAL)

		return () => {
			if (intvl) {
				clearInterval(intvl)
			}
		}
	}, [refreshFarmStats])

	useEffect(() => {
		if (Object.keys(prices).length) {
			setPricesLoaded(true)
		}
	}, [prices, setPricesLoaded])

	return {
		farmStats,
		setGetFarmStats
	}
}

export const FarmProvider = ({ children }) => {
	const farmHooks = useFarm()
	return (
		<FarmContext.Provider value={farmHooks}>{children}</FarmContext.Provider>
	)
}
