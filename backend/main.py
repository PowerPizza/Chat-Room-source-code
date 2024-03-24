from flask import Flask, request, session, render_template
from flask_socketio import SocketIO, join_room, emit, leave_room, close_room
import json

room_list = {}

app = Flask(__name__)  # only for development
web_sock = SocketIO(app, cors_allowed_origins="*")  # only for development
# app = Flask(__name__, template_folder="./", static_folder="./", static_url_path="/")  # for production level
# web_sock = SocketIO(app)  # for production level
app.secret_key = "OSOD33JO9D903MD3"

@app.route("/")
@app.route("/Create")
@app.route("/Join")
def home():
    return render_template("index.html")

@app.route("/create_room", methods=["POST"])
def create_room():
    data_ = json.loads(request.data.decode("utf-8"))
    if data_["room_id"] not in room_list:
        room_list[data_["room_id"]] = {"room_name": data_['room_name'], "users": [], "cur_typing": []}
        return "OK"
    else:
        return "ALREADY_EXISTS"

@web_sock.on("connect")
def on_cli_ctc():
    # join_room(my_rooms, request.sid)
    # print(my_rooms)
    # print("connected to ", request.sid)
    pass

@web_sock.on("registerUserToRoom")
def register_user(creds):
    data_ = json.loads(creds)
    join_room(data_["room_id"], request.sid)
    session["my_creds"] = data_

    for itm in room_list[data_["room_id"]]["users"]:
        if itm["user_id"] == data_["user_id"]:
            emit("createError", "user ID already exists please try again.")
            return
    room_list[data_["room_id"]]["users"].append({"user_id": data_["user_id"], "user_name": data_["user_name"]})
    print(room_list)
    emit("proceedJoining", room_list[data_["room_id"]]["room_name"])
    emit("updateMembers", json.dumps({"members": room_list[data_["room_id"]]["users"]}), broadcast=True, to=data_["room_id"])


@web_sock.on("castMessage")
def cast_message(data_):
    json_data = json.loads(data_)
    json_data["user_id"] = session["my_creds"]["user_id"]
    json_data["user_name"] = session["my_creds"]["user_name"]
    emit("castMessage", json.dumps(json_data), broadcast=True, to=session["my_creds"]["room_id"])


@web_sock.on("castFile")
def handle_file_inc(data_):
    json_data = json.loads(data_.split(b"__@(93d__")[1].decode("utf-8"))
    json_data["user_id"] = session["my_creds"]["user_id"]
    json_data["user_name"] = session["my_creds"]["user_name"]
    json_data = json.dumps(json_data)

    bytes_data = data_.split(b"__@(93d__")[0]
    emit("castFile", bytes_data + b"__@(93d__" + json_data.encode("utf-8"), broadcast=True, to=session["my_creds"]["room_id"])

@web_sock.on("changeTypingStatus")
def changeTypingStatus(data_):
    if data_["user_id"] not in room_list[data_["room_id"]]["cur_typing"] and data_["status"] == "typing":
        room_list[data_["room_id"]]["cur_typing"].append(data_["user_id"])
    elif data_["user_id"] in room_list[data_["room_id"]]["cur_typing"] and data_["status"] == "online":
        room_list[data_["room_id"]]["cur_typing"].remove(data_["user_id"])
    else:
        pass
    to_send = {"cur_typing": room_list[data_["room_id"]]["cur_typing"]}
    emit("changeTypingStatus", json.dumps(to_send),  broadcast=True, to=session["my_creds"]["room_id"])

@web_sock.on("leave_room")
def on_leave_room(data_):
    data_ = json.loads(data_)
    leave_room(data_["room_id"], request.sid)
    idx = 0
    for itm in room_list[data_["room_id"]]["users"]:
        if itm["user_id"] == data_["user_id"]:
            room_list[data_["room_id"]]["users"].pop(idx)
        idx += 1
    if data_["user_id"] in room_list[data_["room_id"]]["cur_typing"]:
        room_list[data_["room_id"]]["current_typing"].remove(data_["user_id"])
    emit("updateMembers", json.dumps({"members": room_list[data_["room_id"]]["users"]}), broadcast=True, to=data_["room_id"])
    session.clear()

@web_sock.on("close_room")
def on_close_room(data_):
    data_ = json.loads(data_)
    emit("roomClosed", "", broadcast=True, room=data_["room_id"])
    del room_list[data_["room_id"]]
    close_room(data_["room_id"])
    session.clear()

@web_sock.on("disconnect")
def on_disconnect():
    session.clear()

@app.route("/cs")
def clear_session():
    session.clear()
    return "200"

if __name__ == '__main__':
    web_sock.run(app, debug=True, allow_unsafe_werkzeug=True, port=5000)