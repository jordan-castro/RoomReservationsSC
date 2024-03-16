from brownie import RoomReservations, accounts, web3


jordan_owner = accounts[0]

evelyn = accounts[1]
eva = accounts[2]
roy = accounts[3]
monica = accounts[4]
vanessa = accounts[5]
william = accounts[6]
mayur = accounts[7]
marco = accounts[8]

rr = RoomReservations.deploy({'from': jordan_owner, 'gas_limit': 6500000})


def main():
    # Add a room
    # Make reservation
    # Pay for room

    rr.addRoom(
        "Room Test", 
        "1212 Street, City, State, Country", 
        "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187.jpg?w=1272&h=848", 
        web3.toWei(10, 'ether'),
        True
    )

    print(rr.rooms(1))

    # Should fail
    rr.makeReservation(0, )