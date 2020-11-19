import React, { useState, useContext, useCallback } from "react"
import {
	onLiquidityPoolDeposit,
	onLiquidityPoolWithdraw,
	isValidNumberString
} from "../actions"
import {
	parseTokens,
	formatTokens,
	formatADXPretty,
	toIdAttributeString
} from "../helpers/formatting"
import { ZERO } from "../helpers/constants"
import {
	TextField,
	Button,
	FormControlLabel,
	Checkbox,
	Box
} from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import AppContext from "../AppContext"
import { useTranslation } from "react-i18next"
import { FarmPoolData } from "./FarmCard"

export default function FarmForm({
	closeDialog,
	pool,
	stats,
	withdraw,
	blockNumber
}) {
	const { t } = useTranslation()
	const { chosenWalletType, wrapDoingTxns } = useContext(AppContext)

	const [actionAmount, setActionAmount] = useState("0.0")
	const [amountErr, setAmountErr] = useState(false)
	const [amountErrText, setAmountErrText] = useState("")
	const [confirmation, setConfirmation] = useState(false)

	const actionName = withdraw ? "withdraw" : "deposit"
	const { depositAssetDecimals, depositAssetName } = pool

	const { pendingADX, userLPBalance, walletBalance } = stats

	const maxAmount = withdraw ? userLPBalance || ZERO : walletBalance

	const onAction = useCallback(
		amount => {
			setConfirmation(false)

			const action = withdraw ? onLiquidityPoolWithdraw : onLiquidityPoolDeposit

			if (closeDialog) closeDialog()

			wrapDoingTxns(
				action.bind(null, {
					pool,
					stats,
					chosenWalletType,
					actionAmount: parseTokens(amount, depositAssetDecimals)
				})
			)()
		},
		[
			chosenWalletType,
			closeDialog,
			depositAssetDecimals,
			pool,
			stats,
			withdraw,
			wrapDoingTxns
		]
	)

	const onRewardsWithdraw = () => {
		onAction("0.00")
	}

	const confirmationLabel = pool.confirmationLabel
	const confirmed = !confirmationLabel || confirmation

	const validateFields = params => {
		const { userInputAmount } = params

		if (!isValidNumberString(userInputAmount)) {
			setAmountErr(true)
			setAmountErrText(t("errors.invalidAmountInput"))
			return
		}

		const amountBN = parseTokens(userInputAmount, depositAssetDecimals)

		const minStakingAmountBN = parseTokens(
			pool.minStakingAmount || "0",
			depositAssetDecimals
		)

		if (amountBN.gt(maxAmount)) {
			setAmountErr(true)
			setAmountErrText(t("errors.lowADXAmount"))
			return
		}
		if (pool && amountBN.lte(minStakingAmountBN)) {
			setAmountErr(true)
			setAmountErrText(t("errors.lessDanMinPoolADX"))
			return
		}

		if (
			!withdraw &&
			pool &&
			stats.poolTotalStaked &&
			pool.poolDepositsLimit &&
			amountBN.add(stats.poolTotalStaked).gt(pool.poolDepositsLimit)
		) {
			setAmountErr(true)
			setAmountErrText(t("errors.amountOverPoolLimit"))
			return
		}

		setAmountErr(false)
		return
	}

	const onAmountChange = amountStr => {
		setActionAmount(amountStr)
		validateFields({
			userInputAmount: amountStr
		})
	}

	return (
		<Box width={1}>
			<Box>
				<TextField
					fullWidth
					id={`new-farm-${actionName}-form-amount-field`}
					required
					label={t("farm.labelLPTokenAmount", { token: depositAssetName })}
					type="text"
					value={actionAmount}
					error={amountErr}
					onChange={ev => {
						onAmountChange(ev.target.value)
					}}
					helperText={amountErr ? amountErrText : null}
				/>
				<Box mt={1}>
					<Button
						fullWidth
						size="small"
						id={`new-farm-${actionName}-form-max-amount-btn`}
						onClick={() => {
							onAmountChange(formatTokens(maxAmount, depositAssetDecimals))
						}}
					>
						{t("common.maxAmountBtn", {
							amount: formatADXPretty(maxAmount),
							currency: depositAssetName
						})}
					</Button>
				</Box>
			</Box>
			<Box>
				{withdraw && (
					<Box my={2}>
						<Alert variant="filled" severity="info">
							{t("farm.withdrawRewardsAlert", {
								pendingADX,
								depositAssetName
							})}
						</Alert>
					</Box>
				)}

				<FarmPoolData
					pollStatsLoaded={true}
					userStatsLoaded={true}
					pool={pool}
					stats={stats}
					blockNumber={blockNumber}
				/>
			</Box>

			{confirmationLabel && (
				<Box>
					<FormControlLabel
						style={{ userSelect: "none" }}
						label={t(confirmationLabel)}
						control={
							<Checkbox
								id={`new-${actionName}-form-tos-check`}
								checked={confirmation}
								onChange={ev => setConfirmation(ev.target.checked)}
							/>
						}
					></FormControlLabel>
				</Box>
			)}
			<Box>
				<Box>
					<Button
						id={`new-${actionName}-farm-btn-${toIdAttributeString(
							pool.poolId
						)}`}
						disableElevation
						fullWidth
						disabled={!confirmed || !!amountErr || !pool || !stats}
						color="primary"
						variant="contained"
						onClick={() => onAction(actionAmount)}
					>
						{withdraw
							? t("common.withdrawCurrency", { currency: depositAssetName })
							: t("common.depositCurrency", { currency: depositAssetName })}
					</Button>
				</Box>

				{!!withdraw && (
					<Box mt={1}>
						<Button
							id={`new-reward-only-withdraw-farm-btn-${toIdAttributeString(
								pool.poolId
							)}`}
							disableElevation
							fullWidth
							disabled={!confirmed || !!amountErr || !pool || !stats}
							color="secondary"
							variant="contained"
							onClick={onRewardsWithdraw}
						>
							{t("farm.withdrawRewardsBtn", { token: "ADX" })}
						</Button>
					</Box>
				)}
			</Box>
		</Box>
	)
}
