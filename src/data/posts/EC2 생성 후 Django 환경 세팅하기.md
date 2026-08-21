---
Created: 2021-10-04
tags:
  - 튜토리얼
  - 블로그발행
---
> 메모용으로 작성하는 글입니다. 아래 조건을 만족시킨 이후의 이야기 입니다.
> 
> -   EC2 인스턴스를 생성 후
> -   ssh 로 접속 후

---

## Part 1. 장고 테스트서버 열기

---

### Django 설치하기

```jsx
// apt 를 최신 버전으로 업그레이드 하기
~$  sudo apt update

// Python 설치 확인 (Ubuntu 20.04 LTS 버전에는 Python이 설치 되어 있다.)
~$  python3 -V // 3.8.5

// Django 설치
~$  sudo apt install python3-django

// Django 설치 확인
~$  django-admin --version // 2.2.12
```

---

### Github에서 프로젝트 다운받기

프로젝트를 클론 받기 위해서 먼저 ssh로 로그인 할 수 있도록 키를 등록해야 한다.

#### Git 설치 확인

Ubuntu 20.04 LTS 버전에는 이미 git이 설치되어있다.

```jsx
~$  git --version // git version 2.25.1
```

#### 키 생성

```jsx
~$  ssh-keygen
```

> -   Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa):  
>     -> 그냥 엔터 누르면 된다. 새로 이름을 지어줄 수 있지만 추천하지 않는다.
> -   Enter passphrase (empty for no passphrase):  
>     -> 비밀번호 설정. 비밀번호가 필요하지 않으면 그냥 엔터 누르면 된다.
> -   Enter same passphrase again:  
>     -> 비밀번호 확인. 위와 똑같이 입력하면 된다.

#### 키 생성 확인

```jsx
~$  cd .ssh
~/.ssh$  ls
// authorized_keys  id_rsa  id_rsa.pub  known_hosts
// id_rsa  id_rsa.pub 두개의 파일이 생성되었음을 확인.
```

#### 내 github 계정에 ssh 키 등록

cat 명령어로 키를 확인하고 `ssh-rsa` 부터 `ip` 까지 전체를 복사한다.

```jsx
~/.ssh$  cat id_rsa.pub
// ssh-rsa AAAAB3NzaC1 ... ubuntu@ip-000-00-00-0 => 전체 복사
```

그 다음 github 페이지에 접속하여 키를 등록한다.  
[https://github.com/settings/keys](https://github.com/settings/keys)

-   `New SSH Key` 버튼 클릭
-   `Title`: 본인이 알아보기 쉬운 이름 입력
-   `Key`: 위 cat 명령어로 복사한 키를 붙여넣기
-   `Add SSH Key` 버튼 클릭
-   SSH Key가 추가 됐는지 확인

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2Ffb1c06f7-d832-4b33-9000-dde908a1b7aa%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-09-21%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.41.33.png)

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F82c4240b-38aa-4325-9312-02f007134d33%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-09-21%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.41.53.png)

#### 프로젝트 클론

본인의 레포지토리 페이지에서 아래 그림의 링크를 복사하여 `git clone` 명령어를 입력한다.

```jsx
~$  git clone git@github.com:<username>/<repository>.git
```

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F4c39c8c7-51bb-4fdf-99f9-d5896867665c%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-09-21%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.22.55.png)

#### Git 유저 설정

```jsx
$  git config user.name <YOUR_USERNAME>
$  git config user.email <YOUR_EMAIL>
```

---

### 가상환경 설정

```jsx
// virtual env 설치
~$  sudo apt install python3-venv

// 가상환경 설정
~$  cd myproject
~/myproject$  python3 -m venv venv

// 가상환경 활성화
~$  source /home/ubuntu/myproject/venv/bin/activate
```

---

### requirements.txt 설치

```jsx
// pip 설치
~$  sudo apt install python3-pip

// 가상환경, 프로젝트 폴더에서 아래 명령어로 requirements를 설치한다.
(venv) ~/myproject$  pip install -r requirements.txt
```

venv 환경에서 `mysqlclient` 를 설치하려고 하면 아래와 같은 에러가 발생할 수 있다.

![](https://velog.velcdn.com/images%2Fjohnyworld%2Fpost%2F8a0d289b-60d7-42bc-a981-b2b14f490f66%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-09-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%2012.12.26.png)

이 경우, 아래 의존성들을 설치하여 해결할 수 있다. 아래 명령어를 입력 후, 설치 완료 후 `mysqlclient` 를 다시 설치해보자.

```null
sudo apt-get install python3-dev libmysqlclient-dev gcc default-libmysqlclient-dev

pip install wheel
```

-   `pip list` 명령어로 설치된 목록을 확인할 수 있다.

---

### Client: NPM 및 패키지 설치 & 빌드

```jsx
// Node Package Manager 설치
~$  sudo apt install npm

// Client의 package.json 의존성 설치
~$  cd myproject/client
~/myproject/client$  npm install
```

아마도 t2.nano 로 인스턴스를 구성하다보니 설치가 엄청 느리다. 심지어 설치가 실패하면서 `killed` 로 끝난다면, 스왑을 다시 구성해줘야 한다. 아래 명령어를 실행 후 `npm install` 을 다시 실행시켜보자. 여전히 엄청 느리긴 한데 일단 계속 진행은 된다.

```null
$  sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024
$  sudo /sbin/mkswap /var/swap.1
$  sudo /sbin/swapon /var/swap.1

// 재시작해도 적용을 위해 파일 수정
$  sudo vi /etc/fstab
/swapfile swap swap defaults 0 0
```

#### Global Dependencies

필요한 글로벌 의존성을 설치한다.

```null
$ sudo npm install -g parcel-bundler
```

#### 빌드

```jsx
// 프론트엔드 파일 빌드
~/myproject/client$  npm run build

// django 서버에서 불러오기 위한 static 파일들을 모아준다.
// settings.py에서 경로에 대한 설정이 되어 있어야 한다.
~/myproject$ python3 manage.py collectstatic --settings=server.settings.prod
```

---

### Env 파일 복사

Server (Django)

```null
~/myproject$  vi env.json
```

Client (React | Preact)

```null
~/myproject/client$  vi .env
```

---

### 탄력적 IP

탄력적 IP 로 변경 후 ssh 로 EC2에 접속하는 경우, `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!` 오류가 발생할 수 있다. 그 경우 keygen 을 초기화 해줘야 한다.

```null
ssh-keygen -R <NEW_PUBLIC_IP>
```

---

### Database 연결

#### mysql 설치하기

```jsx
$  sudo apt update
$  sudo apt install mysql-server
```

#### 로컬 DB 사용하기

```jsx
// 관리자 계정으로 mysql 접속
$  sudo mysql -u root

// 관리자 비밀번호 초기화 (작은 따옴표 안에 새 비밀번호 입력)
mysql>  ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678';

// DB 생성, 선택
mysql>  CREATE DATABASE <DB_NAME> default CHARACTER SET UTF8;
mysql>  USE <DB_NAME>
  
// Access denined 'root'@'localhost' 이슈 발생시
// 초기 설정 되어 있는 mysql의 root 계정의 패스워드 타입을 변경해줘야 한다.
mysql>  USE mysql;
mysql>  SELECT User, Host, plugin FROM mysql.user;
mysql>  update user set plugin='mysql_native_password' where user='root';
mysql>  flush privileges;
mysql>  SELECT User, Host, plugin FROM mysql.user;

// 로컬 테스트
$  python3 manage.py runserver --settings=server.settings.local

// mysql 상태 확인
$  systemctl status mysql.service

// settings.py 의 DATABASES={} 코드도 확인해준다.
```

#### AWS RDS DB 사용하기

연습용 프로젝트라면, EC2 서버에 mysql을 설치하는걸 추천한다. (프리티어 이후 RDS 요금이 추가로 과금된다.) 하지만 나는 AWS RDS 를 사용 해보기 위해 RDS로 DB를 구성했다.

```jsx
// RDS 엔드포인트 접속
$  mysql -u admin -p --host <END_POINT>
  
// db 생성
mysql>  CREATE DATABASE <DB_NAME> default CHARACTER SET UTF8;

// migrate
$  python3 manage.py migrate --settings=server.settings.prod

// settings.py
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': DJANGO_DB_NAME, // 위 RDS 엔드포인트 접속 후 생성한 <DB_NAME>
    'USER': DJANGO_DB_USERNAME, // RDS 만들때 설정했던 계정
    'PASSWORD': DJANGO_DB_PASSWORD, // RDS 계정 비번
    'HOST': DJANGO_DB_HOST, // RDS End-Point
    'PORT': DJANGO_DB_PORT, // 3306
  }
}
```

---

### 서버 접속 테스트

서버를 실행할 경우 로컬에서 테스트할 때와는 다르게 외부 접속을 허용하기 위해 `0:8000` 포트를 지정해줘야 합니다.

```jsx
python3 manage.py runserver 0:8000 --settings=server.settings.prod
```

그 다음 `http://<EC2_END_POINT>:8000` 으로 접속해봅니다.

#### Bad Request (400) 오류 발생

`local`설정으로 서버를 실행하면 문제가 없는데 `prod` 설정으로 서버를 실행시킬 경우 400 에러가 발생했다.

이 때, EC2의 `퍼블릭 IPv4 DNS` 로 접속하면 안되고 `퍼블릭 IPv4 주소` 로 접속하니 잘 접속되었다.

---

## Part 2. 웹 서버 설치하기

---

### uWSGI (Web Server Gateway Interface)

`Client <-> Nginx <-> uWSGI <-> Django`

#### 설치

```jsx
$  pip install uwsgi

// 로그 저장 폴더 생성하기
$  sudo mkdir -p /var/log/uwsgi
```

#### wsgi.py 파일 수정

새로 생성된 `<APP_NAME>/wsgi.py` 파일의 settings 파일 target을 바꿔줘야 한다.

```jsx
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings') 를
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings.prod') 로 수정
```

#### uwsgi.ini 파일 생성

경로는 `/home/ubuntu/<PROJECT_NAME>/<APP_NAME>/uwsgi/uwsgi.ini` 이렇게 설정했다. 다르게 해도 상관 없다.

```jsx
[uwsgi]
chdir = /home/ubuntu/<PROJECT_NAME>
module = server.wsgi
home = /home/ubuntu/<PROJECT_NAME>/venv
wsgi-file = /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/wsgi.py

uid = ubuntu
gid = ubuntu

http = :8000

enable-threads = true
master = true
vacuum = true
pidfile = /tmp/mysite.pid
logto = /var/log/uwsgi/@(exec://date +%%Y-%%m-%%d).log
log-reopen = true
```

#### 실행

```jsx
// ini 파일로 실행
$  sudo /home/ubuntu/<PROJECT_NAME>/venv/bin/uwsgi -i /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/uwsgi/uwsgi.ini

// 커맨드로 실행
$  uwsgi --http :8000 --home /home/ubuntu/<PROJECT_NAME>/venv --chdir /home/ubuntu/<PROJECT_NAME> --wsgi-file /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/wsgi.py
```

---

### NginX

#### 설치

```jsx
$  sudo apt-get install nginx
```

#### 설정 파일 변경

`nginx.conf` 파일을 열고 user를 `ubuntu` 로 변경합니다.

```jsx
$  suso vi /etc/nginx/nginx.conf

user ubuntu;
```

#### 프로젝트에 설정 파일 추가

경로: `<APP_NAME>/nginx/<FILE_NAME>`

```jsx
// 설정 파일 만들기
server {
    listen 80;
  
    // 테스트중일 때
    server_name <퍼블릭 IPv4 주소>;
    
    // 도메인 연결 후
    server_name sample.com www.sample.com;
  
    charset utf-8;
    client_max_body_size 128M;

    location /static/ {
        alias /static/;
    }

    location / {
        uwsgi_pass  unix:///tmp/mysite.sock;
        include     uwsgi_params;
    }
}


// 프로젝트 내의 설정 파일을 nginx 설정 폴더로 복사하기
$  sudo cp -f /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/nginx/<FILE_NAME> /etc/nginx/sites-available/<FILE_NAME>
    
$  // 설정 파일을 `enabled` 폴더로 링크 하기
sudo ln -sf /etc/nginx/sites-available/<FILE_NAME> /etc/nginx/sites-enabled/
    
$  // 기본 설정 파일 삭제
sudo rm /etc/nginx/sites-enabled/default
```

---

### NginX 와 uWSGI 연결하기

#### service 파일 생성하기

경로: `<APP_NAME>/uwsgi/uwsgi.service`

```jsx
[Unit]
Description=uWSGI service

[Service]
ExecStart=/home/ubuntu/<PROJECT_NAME>/venv/bin/uwsgi -i /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/uwsgi/uwsgi.ini
; ExecStart=/home/ubuntu/<PROJECT_NAME>/venv/bin/uwsgi --http :8000 --home /home/ubuntu/<PROJECT_NAME>/venv --chdir /home/ubuntu/<PROJECT_NAME> --wsgi-file /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/uwsgi/wsgi.py

Restart=always
KillSignal=SIGQUIT
Type=notify
StandardError=syslog
NotifyAccess=all

[Install]
WantedBy=multi-user.target
```

#### 파일 링크 걸기

```jsx
$  sudo ln -f /home/ubuntu/<PROJECT_NAME>/<APP_NAME>/wsgi/uwsgi.service /etc/systemd/system/uwsgi.service
```

이로서 uWSGI를 백그라운드에서 실행시킬 수 있습니다.

```jsx
$  sudo systemctl daemon-reload
$  sudo systemctl enable uwsgi
```

---

### Route53 연결하기

> Route53 에서 도메인을 구매 한 상태에서 진행합니다.

1.  [호스팅 영역] 메뉴에서 [호스팅 영역 생성] 을 클릭
    
2.  구매한 도메인만 적어주고, [호스팅 영역 생성]
    
3.  [레코드 생성] 후 값에 EC2 퍼블릭 IP (Elastic IP) 를 적어주고 [레코드 생성] 나머지는 기본 값.
    
4.  도메인과 호스팅 영역의 네임서버가 다른 경우 => `도메인`의 네임서버를 호스팅 영역의 네임서버와 같게 수정해줍니다.
    
5.  약 15분 후 도메인으로 접속이 되는지 확인
    

---

### Https 설정

CertBot 설치

```null
$  sudo apt install certbot python3-certbot-nginx
```

NginX 설정 파일 수정 (위 NginX 설정 파일 부분 참고)

```null
$   sudo vi /etc/nginx/sites-available/<NGINX_SETTING_FILE_NAME>

...
server_name sample.com www.sample.com;
...
```

#### ufw

ufw 기본 정책 설정

```null
$  sudo ufw default deny incoming
$  sudo ufw default allow outgoing
```

방화벽 허용

```jsx
// ufw 방화벽을 활성화 할 경우 ssh 로 접속하는 것도 막아버리게 될 수 있다.
// 반드시 ssh를 허용해주어야 한다. 전에 22번 포트를 허용하는것을 깜빡 잊어서
// ssh로 EC2에 접속할 수 없게 되는 일을 겪었었다.
$  sudo ufw allow ssh
or
$  sudo ufw allow 22

// NginX 관련 방화벽 허용
$  sudo ufw allow 'Nginx HTTPS'
$  sudo ufw deny 'Nginx HTTP'
$  sudo ufw allow 'Nginx Full'

// ufw 활성화
$  sudo ufw enable
```

#### Certbot 설정

```null
$  sudo certbot --nginx -d <DOMAIN> -d www.<DOMAIN>
```

#### error: cannot open .git/FETCH_HEAD: Permission denied

```null
rm -f .git/FETCH_HEAD
```

### 참고

-   [https://stackoverflow.com/questions/38127667/npm-install-ends-with-killed](https://stackoverflow.com/questions/38127667/npm-install-ends-with-killed)
-   [https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)
-   [https://oziguyo.tistory.com/36](https://oziguyo.tistory.com/36)
-   [https://phoenixnap.com/kb/letsencrypt-nginx](https://phoenixnap.com/kb/letsencrypt-nginx)
-   [https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-20-04)
-   [http://www.macnorton.com/csLab/886323](http://www.macnorton.com/csLab/886323)