use std::process::Command;

#[shuttle_runtime::main]
fn main() {
    // Update and upgrade system packages
    run_command("apt-get update").expect("Failed to update package list");
    run_command("apt-get upgrade -y --no-install-recommends").expect("Failed to upgrade packages");

    // Install required packages
    run_command("apt-get install -y --no-install-recommends libfontconfig1 ttf-ancient-fonts nodejs yarn").expect("Failed to install packages");
    
    // Clean up
    run_command("apt-get clean").expect("Failed to clean up");

    // Set environment variables
    let port = "3000"; // Example port
    std::env::set_var("PORT", port);
    std::env::set_var("NODE_ENV", "development");

    // Build the bot
    run_command("yarn install --immutable").expect("Failed to install yarn dependencies");

    // Change environment for production
    std::env::set_var("NODE_ENV", "production");

    // Run the bot
    run_command("yarn start").expect("Failed to start the bot");
}

// Function to run a shell command and wait for it to finish
fn run_command(command: &str) -> std::io::Result<()> {
    let mut parts = command.split_whitespace();
    let cmd = parts.next().unwrap(); // The command itself
    let args = parts; // The rest are arguments

    let status = Command::new(cmd)
        .args(args)
        .status()?; // Execute the command and wait for it to finish

    if !status.success() {
        eprintln!("Command `{}` failed with exit code: {}", command, status);
    }

    Ok(())
}
