sudo yum install git -y
sudo yum install python3 -y
git clone https://github.com/Helgeb/ssrf-aws.git
python3 -m venv venv
source venv/bin/activate
pip install -r ssrf-aws/server/requirements.txt
cd ssrf-aws/server
python server.py