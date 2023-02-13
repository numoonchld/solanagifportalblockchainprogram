use anchor_lang::prelude::*;

declare_id!("411epjTUoVTbocyurmcHzUCcfem35iJ3F3yWQ3ytJZ7w");

#[program]
pub mod solanagifportalblockchainprogram {
    use super::*;

    // constructor function
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // get reference handle to this program's account
        // - basically everything in solana is an account,
        // - so by virtue, this program when deployed also has its own account
        let base_account = &mut ctx.accounts.base_account;

        // initialize variable to hold number of gif's registered with this program's account
        base_account.total_gifs = 0;

        Ok(())
    }

    // Another function woo!
    // The function accepts a gif_link param from the user. We also reference the user from the Context
    pub fn add_gif(ctx: Context<AddGif>, gif_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        // Build the struct.
        let item = ItemStruct {
            gif_link: gif_link.to_string(),
            user_address: *user.to_account_info().key,
        };

        // Add it to the gif_list vector.
        base_account.gif_list.push(item);
        base_account.total_gifs += 1;

        Ok(())
    }
}

// attach a few variables to the context of Initialize method (constructor) of the program
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 10000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddGif<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    // Add the signer who calls the AddGif method to the struct so that we can save it
    #[account(mut)]
    pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}

// set varaible for storage
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    // Attach a Vector of type ItemStruct to the account.
    pub gif_list: Vec<ItemStruct>,
}
