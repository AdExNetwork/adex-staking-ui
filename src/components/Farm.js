import React, { useContext } from "react"
import { FarmContext } from "../FarmProvider"
import AppContext from "../AppContext"
import { Box, useMediaQuery } from "@material-ui/core"
import FarmCard from "./FarmCard"
import FarmInfoCard from "./FarmInfoCard"
import SectionHeader from "./SectionHeader"
import { useTranslation } from "react-i18next"
import { FARM_POOLS } from "../helpers/constants"

const Farm = () => {
	const { t } = useTranslation()
	const { farmStats } = useContext(FarmContext)
	const { chosenWalletType } = useContext(AppContext)
	const {
		pollStatsLoaded,
		userStatsLoaded,
		statsByPoolId,
		blockNumber
	} = farmStats

	const canStake = !!chosenWalletType.name && userStatsLoaded //&& !!appStats.connectedWalletAddress
	const justifyCenter = useMediaQuery(theme => theme.breakpoints.down("xs"))

	return (
		<Box>
			<SectionHeader title={t("common.farm")} actions={<></>} />
			<Box mt={2}>
				<Box
					display="flex"
					flex={1}
					flexDirection="row"
					flexWrap="wrap"
					alignItems="stretch"
					justifyContent={justifyCenter ? "center" : "flex-start"}
				>
					<FarmInfoCard />
					{FARM_POOLS.map(pool => {
						const stats = statsByPoolId ? statsByPoolId[pool.poolId] : {}

						return (
							<FarmCard
								key={pool.token}
								blockNumber={blockNumber}
								loading={!pollStatsLoaded}
								pollStatsLoaded={pollStatsLoaded}
								userStatsLoaded={userStatsLoaded}
								disabled={!canStake}
								disabledInfo={t("common.connectWallet")}
								pool={pool}
								stats={stats}
							/>
						)
					})}
				</Box>
			</Box>
		</Box>
	)
}

export default Farm
