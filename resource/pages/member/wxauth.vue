<template>
	<view>
		<view class="mp-login">
			<view class="mp-logo">
				<image src="/static/logo.svg" mode="widthFix"></image>
			</view>
			<!-- <view class="mp-tips important">为提供优质服务，需要获取你的以下信息:</view> -->
			<!-- <view class="mp-tips">你的公开信息(头像、昵称等)</view> -->
			<view style="padding-top: 30rpx;">
				<u-field label="账号" placeholder="请输入账号" v-model="classicLogin.account"></u-field>
				<u-field label="密码" placeholder="请输入密码" :password="true" v-model="classicLogin.password"></u-field>
				<u-field label="确认密码" placeholder="请输入确认密码" :password="true"
					v-model="classicLogin.password2" v-if="!classicLogin.accountIsExists"></u-field>
				<view class="mp-login-btn" style="padding-top: 10rpx;">
					<u-button @click="doLogin" type="primary" v-if="classicLogin.accountIsExists">登录</u-button>
					<u-button @click="doLogin" type="primary" v-if="!classicLogin.accountIsExists">注册</u-button>
					<view style="padding:20rpx; text-align:center;" @click="classicLogin.accountIsExists = !classicLogin.accountIsExists; classicLogin.password2 = '';">
						<view v-if="!classicLogin.accountIsExists">已有账号？立即登录</view>
						<view v-if="classicLogin.accountIsExists">没有账号？立即注册</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="agreement u-flex">
			<view class="checkbox">
				<u-checkbox v-model="agreementChecked" size="42" :disabled="false"></u-checkbox>
			</view>
			<view class="agreement-text">
				我已认真阅读、理解并同意
				<text class="agreement-link" @click="agreement1">《服务条款》</text>
				<text class="agreement-link">《隐私条款》</text>
			</view>
		</view> -->

		<view class="mp-login-spec">
			<view class="mp-login-spec-decorator"></view>
			<view class="mp-login-btn" v-if="fastLogin.univerifyCanuse" @click="doFastLogin">
				<u-icon name="phone-fill" :size="60" color="#2b85e4"></u-icon>
				<text>手机</text>
				<u-button type="primary" @click="doFastLogin">手机号一键登录/注册</u-button>
			</view>
			<view class="mp-login-btn" @click="doWechatLogin">
				<u-icon name="weixin-fill" :size="60" color="#18b566"></u-icon>
				<text>微信快速登录</text>
			</view>
			<!-- <u-button type="primary" @click="doWechatLogin">微信登录</u-button> -->
		</view>

		<view class="agreement u-flex">
			<view class="agreement-text">
				<view style="display:inline;" @click="agreement.show = true">
					<view style="display:inline; pointer-events:none;">
						<u-checkbox v-model="agreement.checked" size="42" :disabled="false"></u-checkbox>
					</view>
				</view>
				您已理解并同意我们的
				<text class="agreement-link" @click="agreement1">《服务协议》</text>
				以及
				<text class="agreement-link" @click="agreement1">《隐私条款》</text>
				，并授权使用您的账号信息（如昵称、头像等）以便统一管理。
			</view>
		</view>

		<u-popup v-model="agreement.show" mode="center" height="80%" width="90%" :border-radius="12">
			<view class="agreement-wind">
				<scroll-view class="agreement-detail" :scroll-y="true">
					<view style="margin-bottom:60rpx;">
						<view style="font-size:50rpx; font-weight:500; margin-bottom:20rpx;">服务协议</view>
						动妖创作云APP（以下简称本程序），开发者：江西出海软件科技有限公司。<br>
						本APP的web版以及微信小程序版，包括瘦金体网sjtzj.com、字研所小程序APP等形态，同样遵守本政策。<br>
						瘦金体网sjtzj.com（包括字研所小程序、动妖创作云APP等，以下简称本产品）用户协议与服务协议<br>
						
						请您使用本产品之前，请务必仔细阅读并理解《用户许可使用协议》（以下简称“本协议”）中规定的多有权利和限制。<br>
						
						本协议的发布方为江西出海软件科技有限公司，也是本产品的运营方，受中华人民共和国法律法规管制，并遵从APP所在国的相关法律法规。<br>
						
						我们一向尊重并会严格保护用户在使用本产品时的合法权益（包括用户隐私、用户数据等）不受到任何侵犯。<br>
						
						本协议（包括本文最后部分的隐私政策）是用户（包括通过各种合法途径获取到本产品的自然人、法人或其他组织机构，以下简称“用户”或“您”）与我们之间针对本产品相关事项最终的、完整的且排他的协议，并取代、合并之前的当事人之间关于上述事项的讨论和协议。<br>
						
						本协议将对用户使用本产品的行为产生法律约束力，您已承诺和保证有权利和能力订立本协议。用户开始使用本产品将视为已经接受本协议，请认真阅读并理解本协议中各种条款，包括免除和限制我们的免责条款和对用户的权利限制（未成年人审阅时应由法定监护人陪同），如果您不能接受本协议中的全部条款，请勿开始使用本产品。<br>
						
						使用账户<br>
						
						您必须承诺和保证：<br>
						
						您使用本产品的行为必须合法<br>
						
						本产品将会依据本协议“修改和终止”的规定保留或终止您的账户。您必须承诺对您的登录信息保密、不被其他人获取与使用，并且对您在本账户下的所有行为负责。您必须将任何有可能触犯法律的、未授权使用或怀疑为未授权使用的行为在第一时间通知本产品。本产品不对您因未能遵守上述要求而造成的损失承担法律责任。<br>
						
						终端用户协议许可<br>
						
						依据本协议规定，本产品将授予您以下不可转让的、非排他的许可：<br>
						
						1.使用本产品的权利；<br>
						
						2.在您所有的网络通信设备、计算机设备和移动通信设备上下载、安装、使用本产品的权利。<br>
						
						限制性条款<br>
						
						本协议对您的授权将受到以下限制：<br>
						
						您不得对本产品进行任何形式的许可、出售、租赁、转让、发行或其他商业用途；<br>
						
						除非法律禁止此类限制，否则您不得对本产品的任何部分或衍生产品进行修改、翻译、改编、合并、利用、分解、改造或反向编译、反向工程等；<br>
						
						您不得以创建相同或竞争服务为目的使用本产品；<br>
						
						除非法律明文规定，否则您不得对本产品的任何部分以任何形式或方法进行生产、复制、发行、出售、下载或显示等；<br>
						
						您不得删除或破坏包含在本产品中的任何版权声明或其他所有权标记。<br>
						
						费用<br>
						
						您必须自行负担购买本产品的费用，个人上网或第三方（包括但不限于电信或移动通讯提供商）收取的通讯费、信息费等相关费用。如涉及电信增值服务，我们建议您与增值服务提供商确认相关费用问题。<br>
						
						版本<br>
						
						任何本产品的更新版本或未来版本、更新或者其他变更将受到本协议约束。<br>
						
						遵守法律<br>
						
						您同意遵守《中华人民共和国合同法》、《中华人民共和国著作权法》及其实施条例、《全国人民代表大会常务委员会关于维护互联网安全的决定》（“人大安全决定”）、《中华人民共和国保守国家秘密法》、《中华人民共和国电信条例》（“电信条例“）、《中华人民共和国计算机信息系统安全保护条例》、《中华人民共和国计算机信息网络国际联网管理暂行规定》及其实施办法、《计算机信息系统国际联网保密管理规定》、《互联网信息服务管理办法》、《计算机信息网络国际联网安全保护管理办法》、《互联网电子公告服务管理规定》（“电子公告规定”）等相关中国法律法规的任何及所有的规定，并对以任何方式使用您的密码和您的账号使用本服务的任何行为及其结果承担全部责任。如违反《人大安全决定》有可能构成犯罪，被追究刑事责任。《电子公告规定》则有明文规定，上网用户使用电子公告服务系统对所发布的信息负责。《电信条例》也强调，使用电信网络传输信息的内容及其后果由电信用户负责。在任何情况下，如果本网站有理由认为您的任何行为，包括但不限于您的任何言论和其它行为违反或可能违反上述法律和法规的任何规定，本网站可在任何时候不经任何事先通知终止向您提供服务。<br>
						
						用户内容<br>
						
						1.用户内容是指该用户下载、发布或以其他方式使用本产品时产生的所有内容（例如：您的信息、图片、音乐或其他内容）。<br>
						
						2.您是您的用户内容唯一的责任人，您将承担因您的用户内容披露而导致的您或任何第三方被识别的风险。<br>
						
						3.您已同意您的用户内容受到权利限制（详见“权利限制”）<br>
						
						权利限制<br>
						
						您已同意通过分享或其他方式使用本产品中的相关服务，在使用过程中，您将承担因下述行为所造成的风险而产生的全部法律责任：<br>
						
						1.破坏宪法所确定的基本原则的；<br>
						
						2.危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的；<br>
						
						3.损害国家荣誉和利益的；<br>
						
						4.煽动民族仇恨、民族歧视，破坏民族团结的；<br>
						
						5.破坏国家宗教政策，宣扬邪教和封建迷信的；<br>
						
						6.散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；<br>
						
						7.侮辱或者诽谤他人，侵害他人合法权益的；<br>
						
						8.含有法律、行政法规禁止的其他内容的。<br>
						
						您已经同意不在本产品从事下列行为：<br>
						
						1.发布或分享电脑病毒、蠕虫、恶意代码、故意破坏或改变计算机系统或数据的软件；<br>
						
						2.未授权的情况下，收集其他用户的信息或数据，例如电子邮箱地址等；<br>
						
						3.用自动化的方式恶意使用本产品，给服务器造成过度的负担或以其他方式干扰或损害网站服务器和网络链接；<br>
						
						4.在未授权的情况下，尝试访问本产品的服务器数据或通信数据；<br>
						
						5.干扰、破坏本产品其他用户的使用。<br>
						
						修改和终止<br>
						
						修改<br>
						
						本协议容许变更。如果本协议有任何实质性变更，我们将通过电子邮件来通知您。变更通知之后，继续使用本产品则为您已知晓此类变更并同意条款约束；<br>
						
						我们保留在任何时候无需通知而修改、保留或关闭本产品任何服务之权利；<br>
						
						您已同意我们无需因修改、保留或关闭本产品任何服务之权利；<br>
						
						您已同意我们无需因修改、保留或关闭本产品任何服务的行为对您或第三方承担责任。<br>
						
						终止<br>
						
						本协议自您接受之日起生效，在您使用本产品的过程中持续有效，直至依据本协议终止；<br>
						
						尽管有上述规定，如果您使用本产品的时间早于您接受本协议的时间，您在此知晓并同意本协议于您接受本协议的时间，您在此知晓并同意本协议于您第一次使用本产品时生效，除非依据本协议提前终止；
						
						我们可能会依据法律的规定，保留您使用本产品或者本账户的权利；无论是否通知，我们将在任何时间以任何原因终止本协议，包括出于善意的相信您违反了我们可接受使用政策或本协议的其他规定；<br>
						
						不受前款规定所限，如果用户侵犯第三人的版权且我们接到版权所有人或版权所有人的合法代理人的通知后，我们保留终止本协议的权利；<br>
						
						一旦本协议终止，您使用本产品的权利即告终止。您应当知晓您的产品终止意味着您的用户内容将从我们的活动数据库中删除。我们不因终止本协议对您承担任何责任，包括终止您的用户账户和删除您的用户内容。<br>
						
						第三方<br>
						
						您已知晓或同意我们的部分服务时基于第三方的技术支持获得；<br>
						
						您已知晓本协议是您在与我们之前签订，而非您与上述第三方之间签订。我们是基于本产品所产生的内容、维护、支持服务、保证和由此产生的诉讼等事项的唯一责任人。您已同意遵守且授权给本产品限制您有条件地使用本产品的服务。<br>
						
						第三方信息和服务<br>
						
						1.本产品包含了第三方的部分信息和服务。我们不控制且不对第三方的信息和服务负责；<br>
						
						2.我们仅为您使用方便的目的或为承诺和保证第三方的需要而提供此类信息和服务；<br>
						
						3.用户需对使用第三方信息和服务产生的风险承担法律责任；<br>
						
						4.当用户访问第三方信息和服务时，适用第三方的条款和政策。<br>
						
						赔偿<br>
						
						您已同意无害地使用本产品，避免因下述行为或相关行为遭受来第三方的任何投诉、诉讼、损失、损害、责任、成本和费用（包括律师费）：<br>
						
						1.用户使用本产品的行为；<br>
						
						2.用户的用户内容；<br>
						
						3.用户违反本协议的行为。<br>
						
						我们保留专属抗辩权和请求赔偿的权利<br>
						
						您已同意，除非获得我们书面同意，您不得在您与我们共同对第三方提起的诉讼中单方和解。<br>
						
						我们将尽合理努力将此类诉讼、诉讼行为或进程通知您。<br>
						
						在任何情况下，本产品都不对您或任何第三方因本协议产生的任何间接性、后果性、惩罚性的、偶然的、特殊或惩罚性的损害赔偿承担责任。访问、使用本产品所产生的损坏计算机系统或移动通讯设备数据的风险将由您个人承担。<br>
						
						适用法律<br>
						
						本协议适用中华人民共和国法律；<br>
						
						如果双方发生纠纷，应本着友好的圆柱协商解决；如协商不成，应向所在地的法院提起诉讼。<br>
						
						独立性<br>
						
						本协议中的某些条款因故无法适用，则本协议的其他条款继续适用且无法适用的条款将会被修改，以便其能够依法适用。<br>
						
						完整性<br>
						
						本协议（包括隐私政策）是您和本产品之间关于本产品相关事项的最终的、完整的、排他的协议，且取代和合并之前当事人关于此类事项（包括之前的最终用户许可、服务条款和隐私政策）的讨论和协议；<br>
						
						每部分的题目只为阅读之便而无任何法律或合同义务；<br>
						
						除非我们书面同意，您不得转让本协议所规定的权利义务。任何违反上述规定，我们都可以中止服务。<br>
					</view>
					<view style="margin-bottom:60rpx;">
						<view style="font-size:50rpx; font-weight:500; margin-bottom:20rpx;">隐私条款</view>
						动妖创作云APP（以下简称本程序），开发者：江西出海软件科技有限公司。<br>
						本APP的web版以及微信小程序版，包括瘦金体网sjtzj.com、字研所小程序APP等形态，同样遵守本政策。<br>
						我们尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本程序 会按照本隐私权政策的规定使用和披露您的个人信息。但本程序 将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本程序 不会将这些信息对外披露或向第三方提供。本程序会不时更新本隐私权政策。 您在同意本程序 服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本程序 服务使用协议不可分割的一部分，江西出海软件科技有限责任公司作为平台运营企业、本APP开发企业，承担本政策法定责任以及服务。<br>
						
						本APP收集的隐私包括以下清单和作用：<br>
						允许应用通过网络或卫星对设备进行定位，优化用户登录，<br>
						允许应用直接拨打电话，方便联络平台方，<br>
						允许应用拍摄照片或录制视频，方便上传资料如编辑用户头像，<br>
						允许应用获取手机账户、优化登录操作，<br>
						允许应用修改联系人信息，优化用户体验，<br>
						允许应用获取手机号、IMEI、IMSI，用于改进程序性能，<br>
						允许应用程序访问录音路径，用于方便操作上传和存储。<br>
						允许应用修改联系人信息，允许应用读写手机上的照片及文件，用于方便上传、下载内容。<br>
						
						
						适用范围<br>
						a) 在您注册本程序 帐号时，您根据本程序 要求提供的个人注册信息；<br>
						
						b) 在您使用本程序 网络服务，或访问本程序平台网页时，本程序 自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；<br>
						
						c) 本程序 通过合法途径从商业伙伴处取得的用户个人数据。<br>
						
						您了解并同意，以下信息不适用本隐私权政策：<br>
						
						a) 您在使用本程序 平台提供的搜索服务时输入的关键字信息；<br>
						
						b) 本程序 收集到的您在本程序 发布的有关信息数据，包括但不限于参与活动、成交信息及评价详情；<br>
						
						c) 违反法律规定或违反本程序 规则行为及本程序 已对您采取的措施。<br>
						
						信息使用<br>
						a) 本程序 不会向任何无关第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可，或该第三方和本程序 （含本程序 关联公司）单独或共同为您提供服务，且在该服务结束后，其将被禁止访问包括其以前能够访问的所有这些资料。<br>
						
						b) 本程序 亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何本程序 平台用户如从事上述活动，一经发现，本程序 有权立即终止与该用户的服务协议。<br>
						
						c) 为服务用户的目的，本程序 可能通过使用您的个人信息，向您提供您感兴趣的信息，包括但不限于向您发出产品和服务信息，或者与本程序 合作伙伴共享信息以便他们向您发送有关其产品和服务的信息（后者需要您的事先同意）。<br>
						
						与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些用户信息，以提供更好的客户服务和用户体验。我们仅会出于合法、正当、必要、特定、明确的目的共享您的用户信息，并且只会共享提供服务所必要的用户信息。为了更好运营和改善技术和服务，您同意我们和授权合作伙伴在符合相关法律法规的前提下可将收集的信息用于其他服务和用途。<br>
						
						以下列举了具体的授权合作伙伴，并提供了该第三方的隐私政策链接，我们建议您阅读该第三方的隐私政策：<br>
						
						a) 我们的产品的技术包括基于DCloud uni-app(5+ App/Wap2App)开发模块，应用运行期间需要收集您的设备唯一识别码（IMEI/android ID/DEVICE_ID/IDFA、SIM 卡 IMSI 信息）以提供统计分析服务，并通过应用启动数据及异常错误日志分析改进性能和用户体验，为用户提供更好的服务。详情内容请访问《DCloud用户服务条款》。<br>
						
						b) 消息推送服务供应商：由深圳市和讯华谷信息技术有限公司提供推送技术服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息，网络信息以及位置相关信息提供给深圳市和讯华谷信息技术有限公司，用于为您提供消息推送技术服务。我们在向您推送消息时，我们可能会授权深圳市和讯华谷信息技术有限公司进行链路调节，相互促活被关闭的SDK进程，保障您可以及时接收到我们向您推送的消息。详细内容请访问《极光推送用户隐私政策》。<br>
						
						c) 第三方平台登录服务供应商其一：由深圳市腾讯计算机系统有限公司提供微信平台登录技术服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息提供给深圳市腾讯计算机系统有限公司，用于为您提供微信平台登录技术服务。我们在向您呼起微信平台登录时，我们可能会授权深圳市腾讯计算机系统有限公司进行链路调节，相互促活被关闭的SDK进程，保障您可以及时进行微信平台的登录授权。详细内容请访问《微信隐私保护指引》。<br>
						
						d) 第三方平台登录服务供应商其二：由每日互动股份有限公司提供手机号码一键登录技术服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息以及网络信息提供给每日互动股份有限公司，用于为您提供手机号码一键登录技术服务。我们在向您呼起手机号码一键登录时，我们可能会授权每日互动股份有限公司进行链路调节，相互促活被关闭的SDK进程，保障您可以及时进行手机号码一键登录的登录授权。详细内容请访问《个推用户隐私政策》。<br>
						
						e) 移动支付服务供应商：由深圳市腾讯计算机系统有限公司提供微信支付技术服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息以及应用列表信息提供给深圳市腾讯计算机系统有限公司，用于为您提供微信支付技术服务。我们在向您呼起微信支付时，我们可能会授权深圳市腾讯计算机系统有限公司进行链路调节，相互促活被关闭的SDK进程，保障您可以及时进行微信支付授权。详细内容请访问《微信隐私保护指引》。<br>
						
						f) 地图定位服务供应商：由高德软件有限公司提供地图服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息，网络信息以及位置相关信息提供给高德软件有限公司，用于为您提供地图定位技术服务。我们在向您展示地图时，我们可能会授权高德软件有限公司进行链路调节，相互促活被关闭的SDK进程，保障您可以及时使用地图服务。详细内容请访问《高德地图开放平台隐私权政策》。<br>
						
						g) 用户界面渲染服务供应商：由深圳市腾讯计算机系统有限公司提供基于腾讯x5内核的用户界面渲染技术服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息提供给深圳市腾讯计算机系统有限公司，用于为您提供APP界面的渲染展现技术服务。我们在向您展现APP的界面时，我们可能会授权深圳市腾讯计算机系统有限公司进行相互促活被关闭的SDK进程，保障您能够查看APP的操作界面。详细内容请访问《腾讯浏览服务SDK隐私保护声明》。<br>
						
						h) 即时音视频通讯服务供应商：由深圳市腾讯计算机系统有限公司提供即时音视频通讯技术服务，我们可能会将您的设备平台、设备厂商、设备品牌、设备识别码等设备信息以及网络信息提供给深圳市腾讯计算机系统有限公司，用于为您提供即时音视频通讯服务。我们在向您呼起即时音视频通讯时，我们可能会授权深圳市腾讯计算机系统有限公司进行链路调节，相互促活被关闭的SDK进程，保障您可以及时进行即时音视频通讯。详细内容请访问《腾讯 SDK 隐私保护指引》。<br>
						
						信息披露<br>
						在如下情况下，本程序 将依据您的个人意愿或法律的规定全部或部分的披露您的个人信息：<br>
						
						a) 经您事先同意，向第三方披露；<br>
						
						b) 为提供您所要求的产品和服务，而必须和第三方分享您的个人信息；<br>
						
						c) 根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；<br>
						
						d) 如您出现违反中国有关法律、法规或者本程序 服务协议或相关规则的情况，需要向第三方披露；<br>
						
						e) 如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；<br>
						
						f) 在本程序 平台上创建的某一交易中，如交易任何一方履行或部分履行了交易义务并提出信息披露请求的，本程序 有权决定向该用户提供其交易对方的联络方式等必要信息，以促成交易的完成或纠纷的解决。<br>
						
						g) 其它本程序 根据法律、法规或者网站政策认为合适的披露。<br>
						
						信息的收集存储和交换<br>
						信息的使用，本软件会设用设备的拨打电话和管理通话功能。<br>
						
						a) 您使用本软件服务，本软件自动接收并记录的您的手机上的信息，包括但不限于设备的照片、媒体内容、文件、健康数据、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据。<br>
						
						b) 在获得您的数据之后，本软件会将其上传至服务器，以生成您的排行榜数据，以便您能够更好地使用服务。<br>
						
						c) 本程序 收集的有关您的信息和资料将保存在本程序 及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本程序 收集信息和资料所在地的境外并在境外被访问、存储和展示。<br>
						
						Cookie的使用<br>
						a) 在您未拒绝接受cookies的情况下，本程序 会在您的计算机上设定或取用cookies，以便您能登录或使用依赖于cookies的本程序 平台服务或功能。本程序 使用cookies可为您提供更加周到的个性化服务，包括推广服务。<br>
						 b) 您有权选择接受或拒绝接受cookies。您可以通过修改浏览器设置的方式拒绝接受cookies。但如果您选择拒绝接受cookies，则您可能无法登录或使用依赖于cookies的本程序 网络服务或功能。<br>
						
						c) 通过本程序 所设cookies所取得的有关信息，将适用本政策。<br>
						
						信息安全<br>
						a) 本程序 帐号均有安全保护功能，请妥善保管您的用户名及密码信息。本程序 将通过对用户密码进行加密等安全措施确保您的信息不丢失，不被滥用和变造。尽管有前述安全措施，但同时也请您注意在信息网络上不存在“完善的安全措施”。<br>
						
						b) 在使用本程序 网络服务进行网上交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是本程序 用户名及密码发生泄露，请您立即联络本程序 客服，以便本程序 采取相应措施。<br>
						
						7.信息的删除与隐私保护<br>
						
						本程序遵从所在国法律，同时按国家法律规定，提供更正、删除个人信息及注销用户账号功能，并及时响应用户相应操作。<br>
						账号注销渠道只需要致电：0791-86161900，或发邮：web@hx008.com。我们承诺在15个工作日内进行注销，以及根据用户请求完成相应处理。
						
					</view>
				</scroll-view>
				<view class="agreement-btns">
					<view @click="agreement.checked = false; agreement.show = false;"><text>拒绝</text></view>
					<view @click="agreement.checked = true; agreement.show = false;"><text class="success">同意</text></view>
				</view>
			</view>
		</u-popup>

		<!-- <view style="width:100%; padding:26rpx; white-space:normal; word-break:break-all; word-wrap:break-word;">
			<view v-for="log in debugInfo" style="padding:26rpx 0; border-bottom:4rpx solid red;"></view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 许可协议
				agreement: {
					show: false,
					// 是否同意许可协议
					checked: false,
				},

				// 快速登录
				fastLogin: {
					// 是否可使用一键登录
					univerifyCanuse: false,
				},

				// 普通登录
				classicLogin: {
					// 账号是否存在
					accountIsExists: true,
					// 账号
					account: "",
					// 密码
					password: "",
					// 确认密码
					password2: "",
				},

				debugInfo: []
			};
		},
		methods: {
			//一键登录（快速登录）
			doFastLogin() {
				const that = this;
				if (!this.agreement.checked) {
					this.agreement.show = true;
					this.$u.toast('请先阅读并同意服务协议');
					return;
				}

				uni.login({
					provider: "univerify",
					univerifyStyle:{
						 "privacyTerms": {  
						        "defaultCheckBoxState":false, // 条款勾选框初始状态 默认值： true
						        "uncheckedImage":"", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
						        "checkedImage":"", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
						        "checkBoxSize":24, // 可选 条款勾选框大小，仅android支持
						        "textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB  
						        "termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3  
						        "prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
						        "suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”  
						        "privacyItems": [  // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效  
						            {  
						                "url": "https://www.sjtzj.com/item/895", // 点击跳转的协议详情页面,华为896
						                "title": "服务协议" // 协议名称  
						            },
												{  
						                "url": "https://www.sjtzj.com/item/894", // 点击跳转的隐私政策详情页面，华为897
						                "title": "隐私政策" // 协议名称  
						            }  
						        ]  
						    },
					},					
					success: function(res) {
						if (res.errMsg != "login:ok") {
							uni.closeAuthView();
							return;
						}
						uni.closeAuthView();
						uni.showLoading({
							title: "请稍候"
						});
						//res.authResult    {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
						uniCloud.callFunction({
							name: "univerify",
							data: {
								access_token: res.authResult.access_token,
								openid: res.authResult.openid
							}
						}).then(cloudRes => {
							if (!cloudRes.success) {
								uni.showToast({
									title: "服务异常",
									icon: "none"
								});
								return;
							}
							let phoneRes = cloudRes.result;
							if (phoneRes.code != 0) {
								uni.showToast({
									title: "服务异常",
									icon: "none"
								});
								return;
							}

							uni.showLoading({
								title: "请稍候"
							});
							let account = phoneRes.phoneNumber;
							let passwd = that.$zoomla.md5(account);
							that.$u.get("user_info_name", {
								uname: account
							}).then(loginRes => {
								uni.showToast({
									title: "登录成功",
									icon: "none"
								});
								that.$zoomla.setLogin(loginRes.result);
							}).catch(loginErr => {
								uni.showLoading({
									title: "请稍候"
								});
								that.$u.post("user_register", {
									name: account,
									passwd: passwd,
									confirm: passwd
								}).then(regRes => {
									uni.showToast({
										title: "登录成功",
										icon: "none"
									});
									that.$zoomla.setLogin(regRes.result);
								}).catch(regErr => {});
							});
						})
					},
					fail: function(err) {
						switch (err.errCode) {
							case 30001:
								uni.showModal({
									title: "当前网络不适合一键登录，请打开数据网络或使用邮箱登录",
									confirmText: "好的"
								});
								uni.closeAuthView();
								break;
							case 30002: //用户点击其他登录方式
								uni.closeAuthView();
								return;
							case 30003: //用户关闭验证页面
								uni.closeAuthView();
								return;
							default:
								break;
						}
						uni.showToast({
							title: "登录失败(" + err.errCode + ")",
							icon: "none"
						})
						uni.closeAuthView();
					}
				});
			},
			// 普通登录（登录，注册一体）
			doLogin() {
				const that = this;
				if (!this.agreement.checked) {
					this.agreement.show = true;
					this.$u.toast('请先阅读并同意服务协议');
					return;
				}

				if (!this.classicLogin.account) {
					uni.showToast({
						title: "请输入账号",
						icon: "none"
					});
					return;
				}
				if (!this.classicLogin.password) {
					uni.showToast({
						title: "请输入密码",
						icon: "none"
					});
					return;
				}

				// 登录逻辑
				if (this.classicLogin.accountIsExists) {
					this.$u.post("user_login_passwd", {
						name: this.classicLogin.account,
						passwd: this.classicLogin.password
					}).then(res => {
						that.$zoomla.setLogin(res.result);
					}).catch(err => {
						uni.showModal({
							title: "查无此用户，是否用使用现有信息进行注册？",
							success: function(opr) {
								if (!opr.confirm) {
									return;
								}
								that.classicLogin.accountIsExists = false;
							}
						});
					});
					return;
				}

				// 注册逻辑
				if (this.classicLogin.password.length < 8 || this.classicLogin.password.length > 16) {
					uni.showToast({
						title: "密码最小8位，最大16位",
						icon: "none"
					});
					return;
				}
				if (this.classicLogin.password != this.classicLogin.password2) {
					uni.showToast({
						title: "两次输入的密码不一致",
						icon: "none"
					});
					return;
				}

				this.$u.post("user_register", {
					name: this.classicLogin.account,
					passwd: this.classicLogin.password,
					confirm: this.classicLogin.password2
				}).then(res => {
					uni.showToast({
						title: "注册成功",
						icon: "none"
					});
					that.$zoomla.setLogin(res.result);
				}).catch(err => {
					uni.showToast({
						title: err.retmsg,
						icon: "none"
					});
				});
			},
			// 微信登录
			doWechatLogin() {
				const that = this;
				if (!this.agreement.checked) {
					this.agreement.show = true;
					this.$u.toast('请先阅读并同意服务协议');
					return;
				}

				uni.login({
					provider: "weixin",
					success: function() {
						uni.getUserInfo({
							provider: "weixin",
							success: function(res) {
								that.$u.post("user_sync", {
									openid: res.userInfo.openId,
									appId: 3,
									userFace: res.userInfo.avatarUrl,
									honeyName: res.userInfo.nickName,
									puid: 0
								}).then(res => {
									uni.showToast({
										title: "登录成功",
										icon: "none"
									});
									that.$zoomla.setLogin(res.result);
								}).catch(err => {});
							}
						})
					}
				});
			},
			agreement1() {
				this.agreement.show = true;
			}
		},
		onLoad() {
			const that = this;
			uni.preLogin({
				provider: "univerify",
				success: function() {
					that.fastLogin.univerifyCanuse = true;
				},
			});
		}
	}
</script>

<style lang="scss" scoped>
.mp-login{padding: 20rpx 60rpx;
	.mp-tips{
		&.important{font-weight: 600;}
		& + .mp-tips{padding-top: 10rpx;color: #606266;}
	}
}
.mp-login-btn{margin: 40rpx 0;}
.mp-login-spec{display: flex; justify-content: space-around; padding-top: 40rpx; position: relative;
	>.mp-login-btn{display: flex; flex-flow: column; align-items: center;
		>text{color: #777;}
	}
}
.mp-login-spec-decorator{width: 100%; position: absolute; top: 0;}
.tips{font-size: 26rpx;color: #82848A;margin-top: 30rpx;}
.agreement{padding: 0 60rpx; position: fixed; bottom: 10%; white-space: normal; word-break: break-all; word-wrap: break-word;}
.agreement-text{margin-left: -8rpx;	color: $u-tips-color;}
.agreement-link{color: $u-type-warning-dark;}
.agreement-wind{width: 100%; height: 100%; padding: 26rpx; position: relative;}
.agreement-detail{box-sizing: border-box; height: calc(100% - 110rpx);}
.agreement-btns{display: flex; height: 110rpx; padding: 26rpx 0 0 0;
	>view{width: 100%; padding: 0 26rpx;
		>text{display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background: #f4f4f5; border-radius: 14rpx; font-size: 32rpx;}
		>text.success{background: #2979ff; color: #fff;}
	}
	>view:first-child{padding-left: 0;}
	>view:last-child{padding-right: 0;}
}
</style>
