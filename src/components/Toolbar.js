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
import { AddSharp as AddIcon, MenuSharp as MenuIcon } from "@material-ui/icons"
import { Help } from "./HelperMenu"
import { Wallet } from "./WalletMenu"
import { themeMUI } from "./../themeMUi"
import { styles } from "./rootStyles"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(styles)

export const AppToolbar = ({
	chosenWalletType,
	setConnectWallet,
	setNewBondOpen,
	stats,
	handleDrawerToggle
}) => {
	const classes = useStyles()

	return (
		<AppBar className={classes.appBar} color="transparent" position="static">
			<Toolbar className={classes.toolbar}>
				<Hidden mdUp>
					<Box pl={1}>
						<IconButton
							color="secondary"
							aria-label="open drawer"
							onClick={handleDrawerToggle}
						>
							<MenuIcon />
						</IconButton>
					</Box>
				</Hidden>
				<Box
					p={1}
					flex="1"
					display="flex"
					flexDirection="row"
					alignItems="center"
					justifyContent="flex-end"
				>
					<Box mr={2}>
						<Help />
					</Box>
					<Box>
						<Wallet />
					</Box>
				</Box>
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
