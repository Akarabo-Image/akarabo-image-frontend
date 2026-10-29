package akarabostudio.com;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(HeadsUpNotificationsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
