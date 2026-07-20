#!/bin/bash

set -e

OS="$(uname)"

echo "Detected OS: $OS"

if [ "$OS" = "Darwin" ]; then
    echo "Installing packages on macOS..."

    brew update
    brew install python
    brew install node
    brew install postgresql@17
    brew install git
    brew install pipenv

    brew services start postgresql@17

elif [ "$OS" = "Linux" ]; then
    echo "Installing packages on Ubuntu..."

    sudo apt update

    sudo apt install -y \
        python3 \
        python3-pip \
        python3-venv \
        git \
        nodejs \
        npm \
        postgresql \
        postgresql-contrib

    pip3 install --user pipenv

    sudo systemctl enable postgresql
    sudo systemctl start postgresql

else
    echo "Unsupported operating system."
    exit 1
fi

echo "Installation complete!"

# Make it executable:

# chmod +x install.sh

# Run it:

# ./install.sh