import React from "react"
import PropTypes from "prop-types"
import {
	AppBar,
	Toolbar,
	Fab,
	IconButton,
	Box,
	Hidden
} from "@material-ui/core"
import {
	AccountBalanceWalletSharp as AccountBalanceWalletIcon,
	AddSharp as AddIcon,
	MenuSharp as MenuIcon
} from "@material-ui/icons"
import HelperMenu from "./HelperMenu"
import logo from "./../adex-staking.svg"
import { themeMUI } from "./../themeMUi"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => {
	return {
		appBar: {
			top: 0,
			left: 0,
			right: 0,
			width: "auto",
			position: "fixed",
			[theme.breakpoints.up("md")]: {
				left: 250
			}
		},
		toolbar: {
			flexFlow: "wrap",
			height: 69,
			paddingRight: 0,
			paddingLeft: 0
		}
	}
})

export const AppToolbar = ({
	chosenWalletType,
	setConnectWallet,
	setNewBondOpen,
	stats,
	handleDrawerToggle
}) => {
	const classes = useStyles()

	return (
		<AppBar className={classes.appBar} position="static">
			<Toolbar>
				<Hidden mdUp>
					<Box pl={1}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerToggle}
						>
							<MenuIcon />
						</IconButton>
					</Box>
				</Hidden>
				<img height="40vh" src={logo} alt="logo"></img>
				{chosenWalletType && (
					<Fab
						disabled={!stats.loaded}
						onClick={() => setNewBondOpen(true)}
						variant="extended"
						color="secondary"
						style={{ position: "absolute", right: "5%", top: "50%" }}
					>
						<AddIcon style={{ margin: themeMUI.spacing(1) }} />
						{"Stake your ADX"}
					</Fab>
				)}
				{!chosenWalletType && (
					<Fab
						onClick={() => setConnectWallet(true)}
						variant="extended"
						color="secondary"
						style={{ position: "absolute", right: "5%", top: "50%" }}
					>
						<AccountBalanceWalletIcon style={{ margin: themeMUI.spacing(1) }} />
						{"Connect Wallet"}
					</Fab>
				)}
				{HelperMenu()}
			</Toolbar>
		</AppBar>
	)
}

AppToolbar.propTypes = {
	chosenWalletType: PropTypes.string,
	setConnectWallet: PropTypes.func.isRequired,
	setNewBondOpen: PropTypes.func.isRequired,
	stats: PropTypes.object.isRequired
}